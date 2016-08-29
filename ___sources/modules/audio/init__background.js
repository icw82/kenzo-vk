mod.init__background = function() {
    if (ext.options.audio !== true) return;

    mod.on_loaded.dispatch();
}
