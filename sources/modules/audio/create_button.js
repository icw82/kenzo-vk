mod.create_button = function(item) {
    if (typeof item !== 'object') {
        mod.warn('create_button: не передан объект');
        return false;
    }

    if (!(item.dom.element instanceof Element)) {
        mod.warn('create_button: не найден DOM-элемент');
        return false;
    }

    // Удалять ненужные кнопки
    // NOTE: Почему происходит дублирование?
    each (item.dom.element.querySelectorAll('.kz-vk-audio__wrapper'), function(item) {
        item.parentNode.removeChild(item);
    });

    var element = item.dom.element;

    if (!element.parentElement) {
        mod.warn('?:', element);
        return false;
    }

    if (
        (item.type === 'default') ||
        (item.type === 'pad')
    ) {
        var DOM_play = element.querySelector('.area .play_btn');
    } else if (
        (item.type === 'wall') ||
        (item.type === 'search_audio') ||
        (item.type === 'search') ||
        (item.type === 'messages') ||
        (item.type === 'attach')
    ) {
        var DOM_play = element.querySelector('.area .play_btn_wrap');
    }

    item.dom.element.classList.add('kz-audio-element');
    item.dom.actions = item.dom.element.querySelector('.actions');

    item.dom.element.classList.add('kz-ac-' + item.dom.actions.childElementCount);

    // Сокращение ширины индикатора длительности.
    if (item.vk_duration < 600) {
        // Меньше 10-ти минут
        item.dom.element.classList.add('kz-less-10');
    } else if (item.vk_duration < 3600) {
        // Меньше часа
        item.dom.element.classList.add('kz-less-60');
    }

    // Создание кнопки
    var DOM_kz__wrapper = document.createElement('div');
    DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

    var carousel_classes = 'kz-vk-audio__carousel';
    if (mod.options.simplified)
        carousel_classes += ' kz-simplified-view';

    //  title="' + item.id + '"
    DOM_kz__wrapper.innerHTML =
        '<a class="' + carousel_classes + '">' + // draggable="true"
            '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
            '<div class="kz-vk-audio__carousel__item kz-progress">' +
                '<div class="kz-vk-audio__progress-filling"></div>' +
                '<svg class="kz-vk-audio__cross">' +
                    '<use xlink:href="#kzvk-cross" />' +
                '</svg>' +
            '</div>' +
            '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
        '</a>';

    if (DOM_play.nextSibling) {
        DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
    } else {
        DOM_play.parentElement.appendChild(DOM_kz__wrapper);
    }

    item.dom.wrapper = DOM_kz__wrapper;
    item.dom.play_button = DOM_play;

    item.dom.carousel = item.dom.wrapper
        .querySelector('.kz-vk-audio__carousel');
    item.dom.bitrate = item.dom.wrapper
        .querySelector('.kz-vk-audio__carousel__item.kz-bitrate');
    item.dom.progress = item.dom.wrapper
        .querySelector('.kz-vk-audio__carousel__item.kz-progress');
    item.dom.progress__filling = item.dom.wrapper
        .querySelector('.kz-vk-audio__progress-filling');
    item.dom.unavailable = item.dom.wrapper
        .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');

    item.dom.carousel.addEventListener('click', function(event) {
        mod.button_event(item, event);
    }, false);

    item.dom.carousel.addEventListener('dragstart', function(event) {
        mod.button_event(item, event);
    }, false);
}
