mod.init__content = () => {
    // Синхронизация реестра файлов с очередью загрузок;
    mod.queue_sync.init();

    mod.on_loaded.dispatch();
};

mod.init__background = () => {
    const enabled_methods = ['get'];

    mod.cache = new core.SimpleStore({
        name: 'kenzo-vk',
        version: 4,
        store: {
            name: 'files',
            key: false,
            indexes: ['basic.url', 'basic.mime', 'ts']
        }
    });

    each (enabled_methods, (name, index) => {
        if (!(name in mod)) {
            enabled_methods.splice(index, 1);
            mod.warn('Лишний метод');
        }
    });

    const listener = (request, sender, sendResponse) => {
        if (
            (sender.id !== browser.runtime.id) ||
            (request.module !== mod.name) ||
            !enabled_methods.includes(request.method)
        ) return;

        let result = mod[request.method].apply(null, request.arguments);

        if (result instanceof Promise) {
            result.then(result => {
                sendResponse(result);
            }, error => {
                mod.error('Method:', request.method, error);
            });

            return true;
        } else {
            sendResponse(result);
        }
    }

    browser.runtime.onMessage.addListener(listener);

    mod.on_loaded.dispatch();
};
