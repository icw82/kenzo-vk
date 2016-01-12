mod.db_config = {
    name: 'audio',
    version: 5,
    store: null,
    store_name: 'bitrate'
};

mod.db_connect = function(config, callback) {
    var request = indexedDB.open(config.name, config.version);

    request.onupgradeneeded = function(event) {
        if (request.result.objectStoreNames.contains(config.store_name)) {
            request.result.deleteObjectStore(config.store_name);
            mod.log('db_connect — Объект удалён');
        }

        config.store = event.target.result.createObjectStore(config.store_name, {keyPath: 'id'});
    }

    request.onsuccess = function() {
        callback(request.result);
    }

    request.onerror = function() {
        mod.warn('db_connect — error:', event);
    }
}

mod.update_item = function(item, updates) {
    for (var key in updates) {
        item[key] = updates[key];
    }
}

mod.enrich_item = function(item) {
    function get_and_update() {
        mod.get_info_from_mp3(item.url, function(update) {
            mod.update_item(item, update);
            //mod.log(item);

            if (mod.options.cache) {
                // Занести информацию в кэш

                mod.db_connect(mod.db_config, function(db) {
                    var data = {
                        'id': item.id,
                        'size': item.size,
                        'vbr': item.vbr,
                        'bitrate': item.bitrate,
                        'tag_version': item.tag_version,
                        'hash': item.hash
                    }

                    var request = db.transaction([mod.db_config.store_name], 'readwrite')
                        .objectStore(mod.db_config.store_name)
                        .put(data);

                    request.onsuccess = function(event) {
                        db.close();
                    }

                    request.onerror = function() {
                        mod.warn('get_and_update:', event);
                        db.close();
                    }
                });

            }
        });
    }

    if (item.available) {
        if (mod.options.cache) {
            mod.db_connect(mod.db_config, function(db) {
                var request = db.transaction([mod.db_config.store_name], 'readonly')
                    .objectStore(mod.db_config.store_name)
                    .get(item.id);

                request.onsuccess = function(event) {
                    //mod.log(event.target.result);
                    if (event.target.result) {
                        item.bitrate = event.target.result.bitrate;
                        item.size = event.target.result.size;
                        item.tag_version = event.target.result.tag_version;

                        if (typeof event.target.result.vbr !== 'undefined') {
                            item.vbr = event.target.result.vbr;
                            return false;
                        }
                    }

                    // если результата нет, достать новую информацию
                    get_and_update();
                }

                request.onerror = function() {
                    mod.log('db connect error:', event);
                    get_and_update();
                }

            });
        } else {
            get_and_update();
        }
    }
}
