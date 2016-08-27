mod.audio = function(key) {

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
    if (ext.mode === 2016) {

        var isolated_function = function(_) {
            var registered = false;
            var secret_key = null;
            var stop_observe = false;

            if ('ap' in window) {
                register(ap);
            } else {
                // Отлов объекта ap
                kk.proxy(window, 'ap', function(object, property) {
                    if (registered) return;
                    register(ap);
                });
            }

            // Регистрация провайдера и получение секретного ключа
            function register(ap) {
                chrome.runtime.sendMessage(_.id, _.message, function(key) {
                    if (typeof key === 'string') {
                        secret_key = key;
                        registered = true;
                        var keys = ['_isPlaying', '_currentAudio'];

                        if (typeof ap === 'object') {
                            kk.proxy(ap, keys, ap_observer);
                            /*
                                Нужна модификация.
                                Проблема в том, что нельзя задать новый обработчик или
                                убрать имеющийся.

                                kk.proxy(ap, keys);
                                (выдавать ошибку, если свойства
                                    addEventListner и removeEventListner заняты)
                                ap.addEventListner('_isPlaying', callback);
                                ap.removeEventListner('_isPlaying', callback);

                                [или ap.__on__._isPlaying.addEventListner(callback)?]

                                а также полный возврат к нормальному свойству.
                            */

                        } else {
                            console.warn('isolated_function 2016: Прокси не создан');
                        }
                    }
                });
            }

            // Уёбищность как следствие уёбищности кода VK.
            var check_playing = {}
            check_playing.start = function() {
                if (check_playing.id) return;

                check_playing.id = setInterval(function() {
                    ap_observer(ap);

                }, 1000);
            }
            check_playing.stop = function() {
                clearInterval(check_playing.id);
                check_playing.id = false;
            }

            function ap_observer (object, property) {
                if (stop_observe) return;
                //_currentPlaylist

                if (property === '_isPlaying') {
                    if (object._isPlaying) {
                        check_playing.start()
                    } else {
                        check_playing.stop();
                        return;
                    }
                }

                if (!object._isPlaying) return;

                try {
                    if (!object._impl._currentAudioEl) {
                        console.warn('object._impl', object._impl);
                    } else {
                        var info = {
    //                        is_playing: object._isPlaying,
                            current_time: object._impl._currentAudioEl.currentTime,
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

                        console.warn(info);
                    }

                } catch (error) {
                    console.error(error);
//                     stop_observe = true;
                }
            }

        }
    } else if (ext.mode === 2006) {

        var isolated_function = function(_) {
            var registered = false;
            var secret_key = null;
            var stop_observe = false;

            if ('audioPlayer' in window) {
                register(audioPlayer);
            } else {
                // Отлов объекта audioPlayer
                kk.proxy(window, 'audioPlayer', function(object, property) {
                    if (registered) return;
                    register(audioPlayer);
                });
            }

            // Регистрация провайдера и получение секретного ключа
            function register(ap) {
                chrome.runtime.sendMessage(_.id, _.message, function(key) {
                    if (typeof key === 'string') {
                        secret_key = key;
                        registered = true;
//                        var keys = ['_listenedTime', '_currentAudio', '_isPlaying'];
                        var keys = ['curTime', 'lastSong'];

                        if (typeof ap === 'object') {
                            kk.proxy(ap, keys, ap_observer);
                        } else {
                            console.warn('isolated_function: Прокси не создан');
                        }
                    }
                });
            }

            function ap_observer(object, property) {
                if (stop_observe) return;

                try {

                    var info = {
                        current_time: object.curTime,
                        owner: object.lastSong[0],
                        id: object.lastSong[1], // без id владельца
                        url:object.lastSong[2],
                        duration: object.lastSong[3],
                        performer: object.lastSong[5],
                        title: object.lastSong[6]
                    }

                    chrome.runtime.sendMessage(_.id, {
                        action: 'audio status update',
                        key: secret_key,
                        info: info
                    });
                } catch (error) {
                    console.error(error);
                    // stop_observe = true;
                }
            }

        }
    }

    provider.innerHTML = '(' + isolated_function + ')(' + JSON.stringify(_) + ')';

    mod.on_content_load.then(function() {
        document.body.appendChild(provider);
    });
}
