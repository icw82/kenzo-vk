mod.init__background = function() {
    if (ext.options.scrobbler !== true)
        return false;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id)
            return false;

        if (request.action === 'set audio provider key') {
            mod.keys.push(request.key);
            return false;
        }
    });

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        // Существует ничтожно малая вероятность коллизии (примерно 1:(3*10^64))
        if (request.action === 'register audio provider') {
            each (mod.keys, function(key, i) {
               if (key === request.key) {
                   mod.keys[i] = kk.generate_key(15);
                   sendResponse(mod.keys[i]);
                   return true;
               }
            });
        } else if (request.action === 'audio status update') {
            each (mod.keys, function(key, i) {
                if (key === request.key) {
                    if (
                        (typeof request.info.performer == 'string') &&
                        (typeof request.info.title == 'string')
                    ) {
                        request.info.performer = ext.filter.base(request.info.performer)
                        request.info.title = ext.filter.base(request.info.title)

                        if (mod.options.name_filter) {
                            request.info.performer = ext.filter.trash(request.info.performer);
                            request.info.title = ext.filter.trash(request.info.title);
                        }

                        request.info.name = request.info.performer + ' '
                            + ext.options.audio__separator + ' '
                            + request.info.title;

                    } else {
                        mod.warn('#audio status update');
                    }

//                    mod.log('request.info', request.info);
                    mod.center(request.info);
               }
            });
        }
    });

    mod.observe();

    mod.dispatch_load_event();
}
