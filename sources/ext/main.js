const ext = new core.Extention();

// Определение версии ВК
if (location.hostname === 'vk.com')
    ext.mode = 2016;
else if (location.hostname === 'm.vk.com')
    ext.mode = 'm';
else
    ext.mode = false;

ext.init__content = () => {
//    const on_content_load = new Promise(ext.promise__content_load);
//
//    on_content_load.then(function() {
//        document.body.setAttribute('id', 'kz-ext');
//        ext.dom.vk = {
//            header: document.body.querySelector('#page_header_cont'),
//            sidebar: document.body.querySelector('#side_bar'),
//            body: document.body.querySelector('#page_body'),
//            footer: document.body.querySelector('#footer_wrap')
//            //narrow_column_wrap
//        }
//    });
}

ext.init__background = () => {
    // TODO: В утилиты?

//    // Изменения, которые нужно произвести при загрузке новой версии
//    kk.ls.create('ext_version');
//    if (kk.ls.get('ext_version') !== ext.version) {
////        chrome.storage.local.remove('downloads');
////        chrome.storage.local.remove('downloads__current');
////        chrome.storage.local.remove('downloads__queue');
//
//        indexedDB.deleteDatabase('kenzo-vk');
//        indexedDB.deleteDatabase('kenzo-vk-audio');
//
//        kk.ls.update('ext_version', ext.version);
//    }
}
