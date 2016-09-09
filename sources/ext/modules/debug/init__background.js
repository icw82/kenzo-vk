mod.init__background = () => {
    if (!mod.options._) return;

    mod.on_loaded.dispatch();
}
