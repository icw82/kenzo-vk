core.storage.init = () => new Promise((resolve, reject) => {
    core.storage.load('core.storage.init').then(storage => {
        // Слушатель хранилища
        browser.storage.onChanged.addListener((changes, area) => {
            if (area !== 'local')
                return;

//            console.info('browser.storage.onChanged', changes);
//            for (let path in changes) {
//                core.storage.map[path] = changes[path].newValue;
//                if (!(path in core.storage.map)) {
//                    // Новая запись
//                }
//            }

            changes = core.utils.flat_to_object(changes);

            core.storage.load('Слушатель хранилища').then(storage => {
                core.events.on_storage_changed.dispatch(changes);

                for (let name in changes) {
                    let root;
                    if (name === '_') {
                        root = ext;
                    } else {
                        if (name in ext.modules) {
                            root = ext.modules[name];
                        }
                    }

                    root.on_storage_changed.dispatch(changes[name]);
                }

//                console.info('Storage onChanged', changes);
            });
        });

        resolve();
    });
});
