const ext = new core.Extention();

ext.defaults.options = {
    filters: true,
    filters__square_brackets: true,
    filters__curly_brackets: true,
    filters__trash: true,
    download_button__simplified: false,
    debug: {
        _: false,
        log: false,
        styles: false
    }
}

// Определение версии ВК
if (location.hostname === 'vk.com')
    ext.mode = 2016;
else if (location.hostname === 'm.vk.com')
    ext.mode = 'm';
else
    ext.mode = false;

ext.init__content = () => {
    core.events.on_content_loaded.addListener(() => {
        document.body.setAttribute('id', 'kz-ext');

        ext.dom.vk = {
            header: document.body.querySelector('#page_header_cont'),
            sidebar: document.body.querySelector('#side_bar'),
            body: document.body.querySelector('#page_body'),
            footer: document.body.querySelector('#footer_wrap')
            //narrow_column_wrap
        }

        if (ext.options.debug._ && ext.options.debug.styles) {
            kk.class_forever('kzvk-debug', document.body);
        }
    });

    if (!ext.options.debug._) {
        console.warn('ОТЛАДОЧНЫЕ СООБЩЕНИЯ ОТКЛЮЧЕНЫ');
        return;
    }
}

ext.init__background = () => {
    if (!ext.options.debug._) {
        console.warn('ОТЛАДОЧНЫЕ СООБЩЕНИЯ ОТКЛЮЧЕНЫ');
        return;
    }

    // TODO: В утилиты?
//    // Изменения, которые нужно произвести при загрузке новой версии
//    kk.ls.create('ext_version');
//    if (kk.ls.get('ext_version') !== ext.version) {
////        browser.storage.local.remove('downloads');
////        browser.storage.local.remove('downloads__current');
////        browser.storage.local.remove('downloads__queue');
//
//        indexedDB.deleteDatabase('kenzo-vk');
//        indexedDB.deleteDatabase('kenzo-vk-audio');
//
//        kk.ls.update('ext_version', ext.version);
//    }
}

// FIXME: https://vk.com/kenzovk?w=wall-70770587_1572

// FUTURE: генерируемый messages.json;
// FUTURE: Группы загрузок
// FUTURE: Remove_group()
// FUTURE: Clean_queue()
// FUTURE: История загрузок
// FUTURE: Сверка элементов очереди с кэшкм (?)
// FUTURE: Сортировка очереди
// FUTURE: граф связей
// FUTURE: читаемый список групп пользователя
// FUTURE: скрывать или приглушать старые беседы
