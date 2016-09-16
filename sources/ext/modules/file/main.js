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

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (
            (sender.id !== chrome.runtime.id) ||
            (request.module !== mod.name) ||
            !enabled_methods.includes(request.method)
        ) return;

        let result = mod[request.method].apply(null, request.arguments);

        if (result instanceof Promise) {
            result.then(function(result) {
                sendResponse(result);
            }, error => {
                mod.error(request.method, '>', error);
            });

            return true;
        } else {
            sendResponse(result);
        }
    });

    mod.on_loaded.dispatch();
};
