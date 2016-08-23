(function(ext) {

ext.utils.local_console(ext, ext.name);

// Определение версии ВК
ext.mode = (() => {
    if (location.hostname === 'vk.com')
        return 2016;

//    if (location.hostname === 'm.vk.com')
//        return 'm';

    return false;
})();


ext.init = function() {
    ext.info(ext.name, ext);

    ext.dom = {}

    if (ext.scope === 'content') {
        // Подключение Kenzo Kit к странице
        ext.utils.inject_to_DOM('js', chrome.extension.getURL('scripts/kk.min.js'));

        // Подключение стилей
        if (ext.mode === 2016)
            ext.utils.inject_to_DOM('css', chrome.extension.getURL('styles/styles.2016.css'));
        else if (ext.mode === 2006)
            ext.utils.inject_to_DOM('css', chrome.extension.getURL('styles/styles.2006.css'));

        // Встраивание векторной графики
        ext.utils.inject_to_DOM('svg', chrome.extension.getURL('images/graphics.svg'));

    }

    Promise.all([
//        new Promise(ext.promise__content_load),
//        new Promise(load_storage__sync),
        new Promise(load_storage__local)
    ]).then(function() {
        if (ext.scope === 'content')
            init__content();
        else if (ext.scope === 'background')
            init__background();

        init__modules();
    });
}


ext.promise__content_load = function(resolve, reject) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        document.addEventListener('DOMContentLoaded', on_load, false);
        window.addEventListener('load', on_load, false);
    }

    function on_load() {
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        resolve();
    }
};


//var load_storage__sync = function(resolve, reject) {
//    chrome.storage.sync.get(ext.default_options, function(options) {
//        ext.options = options;
//
//        // Прослушивание изменений настроек
//        chrome.storage.onChanged.addListener(function(changes, areaName) {
//            if (areaName == 'sync') {
//                chrome.storage.sync.get(ext.default_options, function(options) {
//                    ext.options = options;
//                });
//            }
//        });
//
//        ext.info('current options', ext.options);
//
//        if (!ext.options.debug__log) {
//            console.warn('ОТЛАДОЧНЫЕ СООБЩЕНИЯ ОТКЛЮЧЕНЫ');
//        }
//
//        resolve();
//    });
//};


var load_storage__local = function(resolve, reject) {
    chrome.storage.local.get(ext.defaults, function(globals) {
        // Set нужен, так как ext.globals не используется, в отличие от ext.options
        chrome.storage.local.set(globals, function() {
            ext.info('current globals', globals);
            resolve();
        });
    });
};


// FUTURE: banlist;
//    var xhr = new XMLHttpRequest();
//    var url = 'https://raw.githubusercontent.com/icw82/blacklist/master/blacklist.json';
//    xhr.open('GET', url, true);
//    xhr.onreadystatechange = function() {
//        if (xhr.readyState !== 4) return;
//        if (xhr.status === 200) {
//            var data = JSON.parse(this.response);//
//        }
//    }
//
//    xhr.send(null);
//
//    https://github.com/icw82/blacklist/blob/master/blacklist.json

// FUTURE: генерируемый messages.json;

// FUTURE: Группы загрузок
// FUTURE: Remove_group()
// FUTURE: Clean_queue()
// FUTURE: История загрузок
// FUTURE: Сверка элементов очереди с кэшкм (?)
// FUTURE: Сортировка очереди
// FUTURE: Сверка элементов очереди с кэшкм (?)
// FUTURE: Сверка элементов очереди с кэшкм (?)

