mod.init__content = function() {
    if (ext.options.video !== true) return;

    kk.class_forever('kz-vk-video', ext.dom.body);

    mod.observe_dom();
    mod.observe_downloads();

    mod.dispatch_load_event();
}
