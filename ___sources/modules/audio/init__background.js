mod.init__background = function() {
    if (mod.options._ !== true) return;

    mod.on_loaded.dispatch();
}
