function save(url, name, element){
    (name) || (name = 'kenzo-vk-audio.mp3');

    var
        xhr = new XMLHttpRequest(),
        progress = 0,
        abort = false,

        // TODO: clean
        DOM_kz__carousel =
            element.querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate =
            element.querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__progress =
            element.querySelector('.kz-vk-audio__carousel__item.kz-progress'),
        DOM_kz__progress_filling =
            element.querySelector('.kz-vk-audio__progress-filling');

    DOM_kz__progress.addEventListener('click', function(event){
        kenzo.stop_event(event);
        xhr.abort();
        abort = true;
        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
        toggle_class(element, 'kz-bitrate', audio_item_classes);
    }, false);

    xhr.responseType = 'blob';
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 1)
            toggle_class(element, 'kz-progress', audio_item_classes);
/*
        if ((xhr.readyState === 4) && (xhr.status === 200)){

        }
*/
    }

    xhr.onprogress = function(progress){
        if (progress.lengthComputable && !abort){
            toggle_class(element, 'kz-progress', audio_item_classes);
            progress = Math.floor(progress.loaded / progress.total * 100);
            DOM_kz__progress_filling.style.left = -100 + progress + '%';
            //DOM_kz__carousel.localName.removeClass('kz-simplified-view');
            //DOM_kz__progress.setAttribute('data-progress', progress + '%');
        }
    }
    xhr.onload = function(){
        var blob = new window.Blob([this.response], {'type': 'audio/mpeg'});
        saveAs(blob, name);
        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
        toggle_class(element, 'kz-bitrate', audio_item_classes);
    }
    xhr.open('GET', url, true);
    xhr.send(null);
};




function process_2(element, info, options){
    var db = null,
        dbName = 'audio',
        dbVersion = 3,
        store = null,
        storeName = 'bitrate';

    var connect = function(callback){
        var request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = function(event){
            if (event.target.result.objectStoreNames.contains(storeName)){
                event.target.result.deleteObjectStore(storeName);
                console.log('KZVK:', 'Объект удалён');
            }

            store = event.target.result.createObjectStore(storeName, {keyPath: 'id'});
        }

        request.onsuccess = function(){
            db = request.result;
            callback(db);
        }

        request.onerror = function(){
            console.log('KZVK:', 'Сonnect error:', event);
        }
    }

    connect(function(db){
        var request = db.transaction([storeName], 'readonly')
            .objectStore(storeName)
            .get(info.id);

        request.onsuccess = function(event){
            if (event.target.result){
                if (!('mp3' in info)) info.mp3 = {};

                info.mp3.bitrate = event.target.result.bitrate;
                info.mp3.size = event.target.result.size;

                if (options.audio__vbr === false){
                    info.mp3.bitrate = false;
                    createButton(element, info);
                    return false;
                }

                if (typeof event.target.result.vbr !== 'undefined'){
                    info.mp3.vbr = event.target.result.vbr;
                    createButton(element, info);
                    return false;
                }
            }

            get_mp3_info(info.vk.url, function(response){
                info.available = response.available;

                if (info.available !== true){
                    createButton(element, info);
                    return false;
                }

                if ('mp3' in response)
                    info.mp3 = response.mp3;

                createButton(element, info);

                // TODO: проверка на наличие битрейта

                connect(function(db){
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

            }, options.audio__vbr);

        }

        request.onerror = function(){
            console.log('KZVK:', 'connect.onerror:', event);
            process__simple(element, info, options);
        }
    });

}
