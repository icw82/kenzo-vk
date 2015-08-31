(function(kzvk) {
'use strict';

var mod = kzvk.modules.scrobbler;

mod.init.background = function() {
    if (kzvk.options.scrobbler !== true)
        return false;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (sender.id !== chrome.runtime.id)
            return false;

        if (request.action === 'set audio provider key'){
            mod.keys.push(request.key);
            return false;
        }
    });

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse){
        // Существует ничтожно малая вероятность коллизии (примерно 1:(3*10^64))
        if (request.action === 'register audio provider'){
            each (mod.keys, function(key, i){
               if (key === request.key){
                   mod.keys[i] = kzvk.make_key();
                   sendResponse(mod.keys[i]);
                   return true;
               }
            });
        } else if (request.action === 'audio status update'){
            each (mod.keys, function(key, i){
                if (key === request.key){
                    if (
                        (typeof request.info.performer == 'string') &&
                        (typeof request.info.title == 'string')
                    ){
                        request.info.performer = kzvk.name_filter(request.info.performer);
                        request.info.title = kzvk.name_filter(request.info.title);

                        request.info.name = request.info.performer + ' '
                            + kzvk.options.audio__separator + ' '
                            + request.info.title;

                        request.info.name = kzvk.name_filter(request.info.name);
                    } else {
                        console.warn('#audio status update');
                    }

                    //console.log('request.info', request.info);
                    mod.center(request.info);
               }
            });
        }
    });

    mod.observe();
}

})(kzvk);
