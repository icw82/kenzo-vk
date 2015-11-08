mod.init__content = function() {
    if (!ext.options.debug) return;

    if (mod.options.styles) {
        kk.class_forever('kz-vk-debug', ext.dom.body);
    }

    mod.dispatch_load_event();
}
