mod.init__background = () => {

    mod.cache = new core.SimpleStore({
        name: 'kenzo-vk',
        version: 4,
        store: {
            name: 'files',
            key: false,
            indexes: ['basic.url', 'basic.mime', 'ts']
        }
    });

    const listener = (request, sender, sendResponse) => {
        if (
            (sender.id !== browser.runtime.id) ||
            (request.module !== mod.name) ||
            !['get'].includes(request.method)
        ) return;

        if (!kk.is_A(request.arguments))
            request.arguments = [request.arguments];

        let result = mod[request.method](...request.arguments);

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
