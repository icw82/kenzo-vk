mod.init__background = function() {
    const enabled_methods = [];

    mod.cache  = new ext.SimpleStore({
        name: 'kenzo-vk',
        version: 4,
        store: {
            name: 'files',
            key: false,
            indexes: ['basic.url', 'basic.mime', 'ts']
        }
    });

    /////////////////

    each ([
        'get'
    ], function(name) {
        if (name in mod)
            enabled_methods.push(name);
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

    mod.dispatch_load_event();

};
