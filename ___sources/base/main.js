(function(ext) {


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

