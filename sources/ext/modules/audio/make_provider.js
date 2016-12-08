// Для 2016
mod.make_provider = function(key) {
    var provider = document.createElement('script');

    // Объект, передаваемый в формате JSON изолированной функции
    var _ = {
        id: chrome.runtime.id,
        message: {
            action: 'register audio provider',
            key: key
        }
    }

    // Функция-провайдер, передаваемая во внешний скрипт в форме текста
    // Работает только в контексте страницы.
    var isolated_function = function(_) {
        var secret_key = null;
        var stop_observe = false;

//        kk.proxy(window, 'ap', function() {
//            console.warn('audioPlayer', arguments);
//        });

        // Регистрация провайдера и получение секретного ключа
        chrome.runtime.sendMessage(_.id, _.message, function() {
            if (typeof arguments[0] === 'string') {
                secret_key = arguments[0];
                if (typeof ap === 'object') {
                    kk.proxy(ap, ['_listenedTime', '_currentAudio', '_isPlaying'], ap_observer);
                } else {
                    console.warn('isolated_function: Прокси не создан');
                }
            }
        });

        var ap_observer = function(object, property) {
            if (stop_observe) return;
            //_currentPlaylist

            try {
                var info = {
                    is_playing: object._isPlaying,
                    current_time: object._listenedTime,
                    id: object._currentAudio[0],
                    owner: object._currentAudio[1],
                    url: object._currentAudio[2],
                    title: object._currentAudio[3],
                    performer: object._currentAudio[4],
                    duration: object._currentAudio[5]
                }

                chrome.runtime.sendMessage(_.id, {
                    action: 'audio status update',
                    key: secret_key,
                    info: info
                });
            } catch (error) {
                console.error(error);
                stop_observe = true;
            }
        }
    };

    provider.innerHTML = '(' + isolated_function + ')(' + JSON.stringify(_) + ')';

    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(provider);
    });
}
