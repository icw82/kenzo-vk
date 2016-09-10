mod.init__content = function() {
    if (ext.options.audio !== true) return;

    if (!ext.mode) return;

    core.events.on_mutation.addListener(mt => {
        let elements;
        let query;

        if (ext.mode === 2016) {
            query = '.audio_row';

        } else if (ext.mode === 2006) {
            query = '.audio';
        }

        if (!query)
            return;

        elements = kk.d.querySelectorAll(query);

        if (elements.length > 0) {
            let item = mod.registry.update(elements);
        }
    });

    mod.on_loaded.dispatch();
}
