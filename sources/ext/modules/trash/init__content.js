mod.init__content = () => {
    if (mod.options._ !== true) return;

    mod.dom.trash_bin = document.createElement('div');
    mod.dom.trash_bin.classList.add('kzvk-trash__bin');
    document.head.appendChild(mod.dom.trash_bin);

    core.events.on_content_loaded.addListener(() => {
        document.body.insertBefore(mod.dom.trash_bin, document.body.firstChild);
    });

    mod.on_loaded.dispatch();
};
