mod.init__content = function() {
    if (!ext.options.debug) return;

    if (mod.options.styles) {
        mod.on_content_load.then(function() {
            if (ext.options.debug__styles)
                kk.class_forever('kzvk-debug', document.body);
        });
    }

    mod.dispatch_load_event();
}
