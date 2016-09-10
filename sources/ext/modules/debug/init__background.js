mod.init__background = () => {
    if (!mod.options._) {
        console.warn('ОТЛАДОЧНЫЕ СООБЩЕНИЯ ОТКЛЮЧЕНЫ');
        return;
    }

    mod.on_loaded.dispatch();
}
