(function(kzvk){
'use strict';

var mod = kzvk.modules.audio;

var gp = {
    dom: {},
    complete: false
};

// Регистрация и Отлов изменений глобального плеера
mod.observe_gp = function(element){
    //console.log('--observe_gp!');

    if (!(element instanceof Element))
        return false;

    if (gp.dom.self instanceof Element)
        return false;

    gp.dom.self = element;

    // Пока нужно только для скробблинга
    if (kzvk.options.scrobbler)
        mod.make_provider(mod.provider_key);

    // FIX: не очень красиво сие
    var observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            // Если плеер ещё не создан полностью
            if (mr.target.getAttribute('id') === 'gp_play_btn'){
                gp.dom.button = mr.target;
            } else if (mr.target.getAttribute('id') === 'gp_performer'){
                gp.dom.performer = mr.target;
            } else if (mr.target.getAttribute('id') === 'gp_title'){
                gp.dom.title = mr.target;
            }
        });

        if (
            (gp.dom.button instanceof Element) &&
            (gp.dom.performer instanceof Element) &&
            (gp.dom.title instanceof Element)
        ){
//            var DOM_kz__wrapper = document.createElement('div');
//                DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');
//
//            var carousel_classes = 'kz-vk-audio__carousel';
//            if (kzvk.options.audio__simplified)
//                carousel_classes += ' kz-simplified-view';
//
//            //  title="' + item.id + '"
//            DOM_kz__wrapper.innerHTML =
//                '<a class="' + carousel_classes + '">' +
//                    '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
//                    '<div class="kz-vk-audio__carousel__item kz-progress">' +
//                        '<div class="kz-vk-audio__progress-filling"></div>' +
//                        '<svg class="kz-vk-audio__cross">' +
//                            '<use xlink:href="#kzvk-cross" />' +
//                        '</svg>' +
//                    '</div>' +
//                    '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
//                    '<div class="kz-vk-audio__carousel__item kz-direct"></div>' +
//                '</a>';
//
//            element.appendChild(DOM_kz__wrapper);
//
//            console.log('*******', DOM_kz__wrapper);

            observer.disconnect();
        }

    });

    observer.observe(gp.dom.self, {childList: true, subtree: true, attributes: true});
}

mod.observe_gb_button = function(){
    var observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            if (mr.type === 'childList'){
                console.log('-- ADD', mr);

            } else if (mr.type === 'attributes'){
                console.log('-- ATTR', mr);

            }
        });
    });

    observer.observe(gp.dom.button, {childList: true, subtree: true, attributes: true});
}

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

        var ap_observer = function(changes) {
            //console.log('** changes:', changes);
            var track = audioPlayer.lastSong;

            var info = {
                current_time: audioPlayer.curTime,
                id: track.aid,
                duration: track[3],
                performer: track[5],
                title: track[6]
            }

            chrome.runtime.sendMessage(_.id, {
                action: 'audio status update',
                key: secret_key,
                info: info
            });
        }

        // Регистрация провайдера и получение секретного ключа
        chrome.runtime.sendMessage(_.id, _.message, function() {
            if (typeof arguments[0] === 'string') {
                secret_key = arguments[0];
                if (typeof audioPlayer === 'object') {
//                    console.log('audioPlayer', audioPlayer);
                    Object.observe(audioPlayer, ap_observer);
                }
            }
        });
    };

    provider.innerHTML = '(' + isolated_function + ')(' + JSON.stringify(_) + ')'

    mod.dom.body.appendChild(provider);
    // Сразу после создания DOM-объекта, функция выполняется.
    // Проверка показала, что скрипт-провайдер выполняется в первую очередь
    // и маловероятно, что чужеродный скрипт (eve.js) может сымитировать поведение
    // провайдера, прежде, чем последний будет выполнен (обменяется ключами с расширением).
}

})(kzvk);
