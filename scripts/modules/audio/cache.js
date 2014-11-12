(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.db_config = {
    db: null,
    dbName: 'audio',
    dbVersion: 3,
    store: null,
    storeName: 'bitrate'
};

mod.db_connect = function(config, callback){
    var request = indexedDB.open(config.dbName, config.dbVersion);

    request.onupgradeneeded = function(event){
        if (event.target.result.objectStoreNames.contains(config.storeName)){
            event.target.result.deleteObjectStore(config.storeName);
            console.config('db_connect — Объект удалён');
        }

        config.store = event.target.result.createObjectStore(config.storeName, {keyPath: 'id'});
    }

    request.onsuccess = function(){
        config.db = request.result;
        callback(config.db);
    }

    request.onerror = function(){
        console.warn('db_connect — error:', event);
    }
}

mod.process = function(){
    mod.db_connect(db_config, function(db){
        var request = db.transaction([storeName], 'readonly')
            .objectStore(storeName)
            .get(info.id);

        request.onsuccess = function(event){
            if (event.target.result){
                if (!('mp3' in info)) info.mp3 = {};

                info.mp3.bitrate = event.target.result.bitrate;
                info.mp3.size = event.target.result.size;

                if (kzvk.options.audio__vbr === false){
                    info.mp3.bitrate = false;
                    //createButton(element, info);
                    return false;
                }

                if (typeof event.target.result.vbr !== 'undefined'){
                    info.mp3.vbr = event.target.result.vbr;
                    //createButton(element, info);
                    return false;
                }
            }

            get_mp3_info(info.vk.url, function(response){
                info.available = response.available;

                if (info.available !== true){
                    //createButton(element, info);
                    return false;
                }

                if ('mp3' in response)
                    info.mp3 = response.mp3;

                //createButton(element, info);

                // TODO: проверка на наличие битрейта

                mod.db_connect(db_config, function(db){
                    var data = {
                        'id': info.id,
                        'size': info.mp3.size,
                        'vbr': info.mp3.vbr,
                        'bitrate': info.mp3.bitrate
                    }

                    var request = db.transaction([storeName], 'readwrite')
                        .objectStore(storeName)
                        .put(data);

                    request.onsuccess = function(event){
                        db.close();
                    }

                    request.onerror = function(){
                        console.warn('KZVK: cache-update:', event);
                        db.close();
                    }
                });

            }, kzvk.options.audio__vbr);

        }

        request.onerror = function(){
            console.log('KZVK:', 'connect.onerror:', event);
            process__simple(element, info, kzvk.options);
        }
    });
}

})(kzvk);


