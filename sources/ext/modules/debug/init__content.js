mod.init__content = () => {
    if (!mod.options._) {
        console.warn('ОТЛАДОЧНЫЕ СООБЩЕНИЯ ОТКЛЮЧЕНЫ');
        return;
    }

    core.events.on_content_loaded.addListener(() => {
        if (mod.options.styles) {
            kk.class_forever('kzvk-debug', document.body);
        }
    });

    mod.on_loaded.dispatch();
}
