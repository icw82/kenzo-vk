var kzvk = (function(){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
// element, node — обязательно DOM Element
// item — элемент списка.

//    "browser_action": {
//        "default_icon": {
//            "19": "icons/19.png",
//            "38": "icons/38.png"
//        }
//    },

// TODO: Очередь закачки.
// TODO:  — Прогресс закачки проигрываемой записи, котороая ещё не попала в кэш браузера.
// FIXME: — Удаление аудиозаписи при активной закачке.
// TODO: Пометка уже скачанных аудиозаписей.

// TODO: Скачивание видео;
// TODO: Определение источника видео при поиске;
// TODO: Удалять в новостях рекламу групп, в которых я и так состою.
// TODO: Сброс натроек;
// TODO: Обнаружение аудиозаписей-клонов;
// TODO: Автоматически определять производительность страниц с кнопками;
// FIXME: Нет кнопок при поиске через проигрыватель (pad);
// FIXME: Не определяется битрейт при появлении новой записи в ленте.

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

/*
(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|


})(kzvk);
*/
