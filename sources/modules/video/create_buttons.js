(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.create_buttons = function (item) {
    if (typeof item !== 'object') {
        mod.warn('create_button: не передан объект');
        return false;
    }

    if (!(item.dom_element instanceof Element)) {
        mod.warn('create_button: не найден DOM-элемент');
        return false;
    }

    if (item.formats.length <= 0) {
        mod.warn('create_button: форматы не обнаружены');
        return false;
    }

    var DOM_box = document.querySelector('#mv_box');

    if (!DOM_box || !DOM_box.contains(item.dom_element)) {
        mod.warn('Оу, похоже, что-то пошло не так.');
        return false;
    }

    var DOM_host = DOM_box.querySelector('.mv_info_panel');

    var DOM_kz__buttons = document.createElement('div');
    DOM_kz__buttons.classList.add('kz-vk-video__buttons');

    var carousel_classes = 'kz-vk-video__carousel';
    if (mod.options.simplified)
        carousel_classes += ' kz-simplified-view';

    item.formats.sort(function (a, b) {
        return a.format > b.format
    });

    each (item.formats, function (item) {
        item.dom_element = document.createElement('div');
        item.dom_element.classList.add('kz-vk-video__wrapper');
        item.dom_element.innerHTML =
            '<a class="' + carousel_classes + '">' +
                '<div class="kz-vk-video__carousel__item kz-format"></div>' +
                '<div class="kz-vk-video__carousel__item kz-progress">' +
                    '<div class="kz-vk-video__progress-filling"></div>' +
                    '<svg class="kz-vk-video__cross">' +
                        '<use xlink:href="#kzvk-cross" />' +
                    '</svg>' +
                '</div>' +
                '<div class="kz-vk-video__carousel__item kz-unavailable"></div>' +
            '</a>';

        DOM_kz__buttons.appendChild(item.dom_element);
    });

    DOM_host.insertBefore(DOM_kz__buttons, DOM_host.firstChild);

    each (item.formats, function (item) {
        item.dom_carousel = item.dom_element
            .querySelector('.kz-vk-video__carousel');
        item.dom_format = item.dom_element
            .querySelector('.kz-vk-video__carousel__item.kz-format');
        item.dom_progress = item.dom_element
            .querySelector('.kz-vk-video__carousel__item.kz-progress');
        item.dom_progress__filling = item.dom_element
            .querySelector('.kz-vk-video__progress-filling');
        item.dom_unavailable = item.dom_element
            .querySelector('.kz-vk-video__carousel__item.kz-unavailable');

        item.dom_carousel.addEventListener('click', function (event) {
            mod.button_event(item, event);
        }, false);

        item.dom_carousel.addEventListener('dragstart', function (event) {
            mod.button_event(item, event);
        }, false);
    });
}

})(kzvk);
