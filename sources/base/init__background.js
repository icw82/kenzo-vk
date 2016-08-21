function init__background() {

    // Изменения, которые нужно произвести при загрузке новой версии
    kk.ls.create('ext_version');
    if (kk.ls.get('ext_version') !== ext.version) {
//        chrome.storage.local.remove('downloads');
//        chrome.storage.local.remove('downloads__current');
//        chrome.storage.local.remove('downloads__queue');

        indexedDB.deleteDatabase('kenzo-vk');
        indexedDB.deleteDatabase('kenzo-vk-audio');

        kk.ls.update('ext_version', ext.version);
    }
}
