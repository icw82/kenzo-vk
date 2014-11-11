(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.create_button = function(item){
    if (typeof item !== 'object'){
        console.warn('create_button: не передан объект');
        return false;
    }
    if (!(item.dom_element instanceof Element)){
        console.warn('create_button: не найден DOM-элемент');
        return false;
    }

    var element = item.dom_element;

    if (!element.parentElement){
        console.warn('?:', element);
        return false;
    }

    if (
        (item.element_type === 'default') ||
        (item.element_type === 'pad')
    ){
        var DOM_play = element.querySelector('.area .play_btn');
    } else if (
        (item.element_type === 'wall') ||
        (item.element_type === 'search_audio') ||
        (item.element_type === 'search') ||
        (item.element_type === 'messages') ||
        (item.element_type === 'attach')
    ){
        var DOM_play = element.querySelector('.area .play_btn_wrap');
    }

    // Создание кнопки
    var DOM_kz__wrapper = document.createElement('div');
    DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

    var carousel_classes = 'kz-vk-audio__carousel';
    if (kzvk.options.audio__simplified)
        carousel_classes += ' kz-simplified-view';

    DOM_kz__wrapper.innerHTML =
        '<div class="' + carousel_classes + '">' +
            '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
            '<div class="kz-vk-audio__carousel__item kz-progress">' +
                '<div class="kz-vk-audio__progress-filling"></div>' +
            '</div>' +
            '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
            '<div class="kz-vk-audio__carousel__item kz-direct"></div>' +
        '</div>';

    if (DOM_play.nextSibling){
        DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
    } else {
        DOM_play.parentElement.appendChild(DOM_kz__wrapper);
    }

    item.dom_wrapper = DOM_kz__wrapper;

    item.dom_carousel = item.dom_wrapper
        .querySelector('.kz-vk-audio__carousel');
    item.dom_bitrate = item.dom_wrapper
        .querySelector('.kz-vk-audio__carousel__item.kz-bitrate');
    item.dom_unavailable = item.dom_wrapper
        .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');

    item.dom_unavailable.addEventListener('click', kenzo.stop_event, false);

//        DOM_kz__bitrate.addEventListener('click', function(event){
//            kenzo.stop_event(event);
//
//            chrome.runtime.sendMessage({
//                action: 'save-vk-audio',
//                url: item.vk.url,
//                name: item.vk.artist + ' ' + options.audio__separator + ' '
//                    + item.vk.title + '.mp3',
//                vk: item.vk
//            });
//
//            console.log('Отправлено в загрузки');
//
//        }, false);

}

})(kzvk);
