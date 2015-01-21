(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.video;

mod.update_button__basic = function(item){
    var message = item.format || '…';

    kenzo.toggle_class(item.dom_element, 'kz-format', mod.button_classes, false);
    item.dom_format.setAttribute('data-message', message);
    item.dom_carousel.setAttribute('href', item.url);

    var format_classes = [
        'kz-vk-video__format--normal',
        'kz-vk-video__format--crap'
    ];

    var button_sizes = [
        'kz-s3',
        'kz-s4'
    ];

    if (item.format > 999){
        kenzo.toggle_class(item.dom_element, 'kz-s4', button_sizes, false);
    } else {
        kenzo.toggle_class(item.dom_element, 'kz-s3', button_sizes, false);
    }

    if (item.format >= 720){
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-video__format--normal', format_classes, false);
    } else{
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-video__format--crap', format_classes, false);
    }

}

mod.update_button__download_progress = function(item){
    if (item.progress === null){
        kenzo.toggle_class(item.dom_element, 'kz-format', mod.button_classes, false);
    } else {
        item.dom_progress__filling.style.left = -100 + item.progress + '%';
        //item.dom_progress.setAttribute('data-progress', item.progress + '%');

        if (!item.dom_element.classList.contains('kz-progress'))
            kenzo.toggle_class(item.dom_element, 'kz-progress', mod.button_classes, false);
    }
}

mod.update_button = function(item, changes){

//    if (!item.available){
//        kenzo.toggle_class(item.dom_element, 'kz-unavailable', mod.button_classes, false);
//        return false;
//    }


    if (
        (changes.indexOf('dom_wrapper') > -1) ||
        (changes.indexOf('dom_carousel') > -1) ||
        (changes.indexOf('format') > -1) ||
        (changes.indexOf('error') > -1)
    ){
        mod.update_button__basic(item);
    }

    if (changes.indexOf('progress') > -1){
        mod.update_button__download_progress(item);
    }

};

})(kzvk);
