mod.init__background = () => {
    if (mod.options._ !== true)
        return;

    mod.on_loaded.dispatch();
}
