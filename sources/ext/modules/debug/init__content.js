mod.init__content = () => {

    if (!mod.options._) return;

    core.events.on_content_loaded.then(() => {
        if (mod.options.styles) {
            kk.class_forever('kzvk-debug', document.body);
        }
    });

    mod.on_loaded.dispatch();
}
