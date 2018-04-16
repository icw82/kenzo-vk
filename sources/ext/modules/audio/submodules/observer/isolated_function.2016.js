// Функция-провайдер, передаваемая во внешний скрипт в форме текста
// Работает в контексте страницы.
const isolated_function_2016 = args => {

//    const log_prefix = args.full_name + ' (page) —';

//    properties = args
//    let secret_key;
//    let stop_observe = false;
//    let current = false;

//    args.debug &&
//        console.log(log_prefix, '!!!');

//    KenzoTransceiver.postMessage('message yo', 'bg', response => {
//        args.debug &&
//            console.log(log_prefix, 'callback', response);
//    });

//    var browser = chrome; // FIXME
//
//    // Регистрация провайдера и получение секретного ключа
//    // TODO: Нужен новый механизм передачи данных со страницы в расширение,
//    //       потому что некоторые браузеры не умеют в browser.runtime
//    //       kk.r.postMessage(message, 'https://vk.com');
//    {
//        const message = {
//            target: properties.id,
//            action: properties.actions.register,
//            key: properties.key
//        }
//
//        // TODO: новый интерфейс
//        browser.runtime.sendMessage(properties.id, message, key => {
//            if (!kk.is.s(key))
//                return;
//
//            secret_key = key;
//        });
//    }
//
//    kk.watch(window, 'ap', window => {
//        if (!kk.is.o(window.ap) || window.ap === null) {
//            warn('Некорректный объект плеера')
//            return;
//        }
//
//        if (current === window.ap) {
////            console.log('current');
//        } else {
////            console.log('new AP', window.ap);
//            current = window.ap;
//
//            const keys = ['_isPlaying', '_currentAudio'];
//
//            kk.watch(window.ap, keys, player_observer);
//        }
//    });
//
//    const player_observer = (object, property) => {
//        if (stop_observe)
//            return;
//
//        if (property === '_isPlaying') {
//            if (object._isPlaying) {
//                check_playing.start()
//            } else {
//                check_playing.stop();
//                return;
//            }
//        }
//
//        if (!object._isPlaying)
//            return;
//
//        try {
//            if (!object._impl._currentAudioEl) {
//                console.warn('object._impl', object._impl);
//            } else {
//                const message = {
//                    action: properties.actions.update,
//                    key: secret_key,
//                    info: {
////                        is_playing: object._isPlaying,
//                        current_time: object._impl._currentAudioEl.currentTime,
//                        id: object._currentAudio[0],
//                        owner: object._currentAudio[1],
//                        url: object._currentAudio[2],
//                        title: object._currentAudio[3],
//                        performer: object._currentAudio[4],
//                        duration: object._currentAudio[5]
//                    }
//                }
//
//                if (secret_key) {
//                    // TODO: Новый интерфейс
//                    browser.runtime.sendMessage(properties.id, message);
//                }
//            }
//
//        } catch (error) {
//            console.error(error);
////                 stop_observe = true;
//        }
//    }
//
//    // Уёбищность как следствие уёбищности кода VK.
//    const check_playing = {
//        id: null,
//        start: () => {
//            if (this.id)
//                return;
//
//            this.id = setInterval(function() {
//                player_observer(ap);
//
//            }, 1000);
//
//        },
//        stop: () => {
//            clearInterval(this.id);
//            this.id = null;
//        }
//    }
}

if (ext.mode === 2016) {
    sub.isolated_function = isolated_function_2016;
}
