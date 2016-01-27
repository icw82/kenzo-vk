mod.init__background = function() {
    if (ext.options.audio !== true) return;

    var enabled_methods = (function() {
        var _ = [];

        each ([
            'get_audio_info'
        ], function(name) {
            if (name in mod)
                _.push(name);
        });

        return _;
    })();

//    mod.watch.start();
//    chrome.downloads.onChanged.addListener(mod.downloads_listner);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id) return;
        if (enabled_methods.indexOf(request.method) < 0) return;

        let result = mod[request.method].apply(null, request.arguments);

        if (result instanceof Promise) {
            result.then(function(result) {
//                mod.warn('sendResponse', );
                sendResponse(result);
            }, function() {
                mod.warn('BG methods error');
            });

            return true;
        } else {
            sendResponse(result);
        }
    });

    mod.dispatch_load_event();
}
