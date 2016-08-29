mod.init__content = () => {
//    if (!ext.options.debug) return;
//
//    if (mod.options.styles) {
//        mod.on_content_load.then(function() {
//            if (ext.options.debug__styles)
//                kk.class_forever('kzvk-debug', document.body);
//        });
//    }

    mod.on_loaded.dispatch();
}
