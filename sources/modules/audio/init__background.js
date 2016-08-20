mod.init__background = function() {
    if (ext.options.audio !== true) return;

    mod.dispatch_load_event();
}
