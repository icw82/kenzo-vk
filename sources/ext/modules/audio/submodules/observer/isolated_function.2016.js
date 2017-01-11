// Функция-провайдер, передаваемая во внешний скрипт в форме текста
// Работает в контексте страницы.
const isolated_function_2016 = properties => {
    let registered = false;
    let secret_key = null;
    let stop_observe = false;

    var browser = chrome; // FIXME

    // Регистрация провайдера и получение секретного ключа
    const register = ap => {
        const message = {
            target: properties.id,
            action: properties.actions.register,
            key: properties.key
        }

        // TODO: Нужен новый механизм передачи данных со страницы в расширение,
        //       потому что некоторые браузеры не умеют в browser.runtime
//        kk.r.postMessage(message, 'https://vk.com');

        browser.runtime.sendMessage(properties.id, message, key => {
            if (!kk.is_s(key))
                return;

            secret_key = key;
            registered = true;

            const keys = ['_isPlaying', '_currentAudio'];

            if (!kk.is_o(ap)) {
                console.warn('isolated_function 2016: Прокси не создан');
                return;
            }

            kk.proxy(ap, keys, ap_observer);

//            console.warn(ap);

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

        });
    }

    const ap_observer = (object, property) => {
        if (stop_observe)
            return;

        if (property === '_isPlaying') {
            if (object._isPlaying) {
                check_playing.start()
            } else {
                check_playing.stop();
                return;
            }
        }

        if (!object._isPlaying)
            return;

        try {
            if (!object._impl._currentAudioEl) {
                console.warn('object._impl', object._impl);
            } else {
                const message = {
                    action: properties.actions.update,
                    key: secret_key,
                    info: {
//                        is_playing: object._isPlaying,
                        current_time: object._impl._currentAudioEl.currentTime,
                        id: object._currentAudio[0],
                        owner: object._currentAudio[1],
                        url: object._currentAudio[2],
                        title: object._currentAudio[3],
                        performer: object._currentAudio[4],
                        duration: object._currentAudio[5]
                    }
                }

                browser.runtime.sendMessage(properties.id, message);
//                console.log('>>>', message.info);
            }

        } catch (error) {
            console.error(error);
//                 stop_observe = true;
        }
    }

    if ('ap' in window) {
        register(ap);
    } else {
        // Отлов объекта ap
        kk.proxy(window, 'ap', (object, property) => {
            if (registered)
                return;
            register(ap);
        });
    }

    // Уёбищность как следствие уёбищности кода VK.
    const check_playing = {
        id: null,
        start: () => {
            if (this.id)
                return;

            this.id = setInterval(function() {
                ap_observer(ap);

            }, 1000);

        },
        stop: () => {
            clearInterval(this.id);
            this.id = null;
        }
    }
}

if (ext.mode === 2016) {
    sub.isolated_function = isolated_function_2016;
}
