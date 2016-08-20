mod.init__content = function() {
    if (ext.options.trash !== true) return;

    ext.dom.trash_bin = document.createElement('div');
    ext.dom.trash_bin.classList.add('kzvk-trash__bin');
    document.head.appendChild(ext.dom.trash_bin);

    mod.on_content_load.then(function() {
        document.body.insertBefore(ext.dom.trash_bin, document.body.firstChild);
    });

    mod.init_dom_observers();

    mod.dispatch_load_event();

};
