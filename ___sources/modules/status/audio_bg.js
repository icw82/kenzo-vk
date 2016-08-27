mod.audio_bg = function() {
    mod.on_audio_play = new kk.Event();

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id)
            return false;

        if (request.action === 'set audio provider key') {
            mod.audio_player_keys.push(request.key);
            mod.log('audio_player_keys', mod.audio_player_keys);
            return false;
        }
    });

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        // Существует ничтожно малая вероятность коллизии (примерно 1:(3*10^64))
        if (request.action === 'register audio provider') {
            each (mod.audio_player_keys, function(key, i) {
               if (key === request.key) {
                   mod.audio_player_keys[i] = kk.generate_key(15);
                   sendResponse(mod.audio_player_keys[i]);
                   return true;
               }
            });
        } else if (request.action === 'audio status update') {
            each (mod.audio_player_keys, function(key, i) {
                if (key !== request.key) return;

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
                    mod.warn('audio update ERROR');
                }

//                mod.log('request.info', request.info);
                mod.audio__info = request.info;
                mod.on_audio_play.dispatch();
            });
        }
    });

}
