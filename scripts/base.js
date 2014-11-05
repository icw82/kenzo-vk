'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var kzvk = (function(){
    var manifest = chrome.runtime.getManifest();

    var _ = {
        name: manifest.name,
        version: manifest.version,
        options: null,
        globals: {},
        modules: {}
    };

    _.init = function(){
        for (var mod in _.modules){
            if (typeof _.modules[mod].init == 'function'){
                console.info('Инициация модуля', mod);
                _.modules[mod].init();
            }
        };

        // Прослушивание изменений настроек и глобальных переменных
        chrome.storage.onChanged.addListener(function(changes, areaName){
            if (areaName == 'local'){
                chrome.storage.local.get(default_globals, function(storage){
                    _.globals.now_playing = storage.audio.now_playing;
                    console.log('now_playing', _.globals.now_playing);
                });
            } else if (areaName == 'sync'){
                chrome.storage.sync.get(default_options, function(sync_storage){
                    _.options = sync_storage;
                });
            }
        });
    }

    return _;
})();
