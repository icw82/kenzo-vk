mod.create_buttons = function (item) {
    if (typeof item !== 'object') {
        mod.warn('create_button: не передан объект');
        return false;
    }

    if (!(item.dom.element instanceof Element)) {
        mod.warn('create_button: не найден DOM-элемент');
        return false;
    }

    if (item.formats.length <= 0) {
        mod.warn('create_button: форматы не обнаружены');
        return false;
    }

    var DOM_box = document.querySelector('#mv_box');

    if (!DOM_box || !DOM_box.contains(item.dom.element)) {
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

    mod.log('******', item.formats);

    each (item.formats, function (item) {
        item.dom.element = document.createElement('div');
        item.dom.element.classList.add('kz-vk-video__wrapper');
        item.dom.element.innerHTML =
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

        DOM_kz__buttons.appendChild(item.dom.element);
    });

    DOM_host.insertBefore(DOM_kz__buttons, DOM_host.firstChild);

    each (item.formats, function (item) {
        item.dom.carousel = item.dom.element
            .querySelector('.kz-vk-video__carousel');
        item.dom.format = item.dom.element
            .querySelector('.kz-vk-video__carousel__item.kz-format');
        item.dom.progress = item.dom.element
            .querySelector('.kz-vk-video__carousel__item.kz-progress');
        item.dom.progress__filling = item.dom.element
            .querySelector('.kz-vk-video__progress-filling');
        item.dom.unavailable = item.dom.element
            .querySelector('.kz-vk-video__carousel__item.kz-unavailable');

        item.dom.carousel.addEventListener('click', function (event) {
            mod.button_event(item, event);
        }, false);

        item.dom.carousel.addEventListener('dragstart', function (event) {
            mod.button_event(item, event);
        }, false);
    });
}
