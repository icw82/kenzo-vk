mod.update_button = function(item) {
    var message = item.format || '…';

    kk.class(item.dom.element, 'kz-format', mod.button_classes);
    item.dom.format.setAttribute('data-message', message);
    item.dom.carousel.setAttribute('href', item.url);
    item.dom.carousel.setAttribute('download', item.filename);

    var button_sizes = [
        'kz-s3',
        'kz-s4'
    ];

    if (item.format > 999) {
        kk.class(item.dom.element, 'kz-s4', button_sizes);
    } else {
        kk.class(item.dom.element, 'kz-s3', button_sizes);
    }

    var format_classes = [
        'kz-vk-video__format--normal',
        'kz-vk-video__format--crap'
    ];

    if (item.format >= 720) {
        kk.class(item.dom.carousel, 'kz-vk-video__format--normal', format_classes);
    } else{
        kk.class(item.dom.carousel, 'kz-vk-video__format--crap', format_classes);
    }

}

mod.update_button__download_progress = function(item) {
    if (item.progress === null) {
        kk.class(item.dom.element, 'kz-format', mod.button_classes);
    } else {
        item.dom.progress__filling.style.left = -100 + item.progress + '%';
        //item.dom.progress.setAttribute('data-progress', item.progress + '%');

        if (!item.dom.element.classList.contains('kz-progress'))
            kk.class(item.dom.element, 'kz-progress', mod.button_classes);
    }
}
