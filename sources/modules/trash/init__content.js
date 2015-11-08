mod.init__content = function() {
    if (ext.options.trash !== true) return;

    ext.dom.trash_bin = document.createElement('div');

    kk.class_forever('kz-vk-trash', ext.dom.body);

    ext.dom.trash_bin.classList.add('kz-vk-trash__bin');
    ext.dom.body.insertBefore(ext.dom.trash_bin, ext.dom.body.firstChild);

    mod.observe_dom();

    mod.dispatch_load_event();
}
