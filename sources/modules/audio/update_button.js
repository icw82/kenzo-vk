(function(kzvk){
'use strict';

var mod = kzvk.modules.audio;

mod.update_button__basic = function(item){
    var message = ' ';

    item.bitrate__classic = mod.calc_bitrate_classic(item.size, item.vk_duration);
    item.bitrate__average = Math.floor(item.size * 8 / item.vk_duration / 1000);

    if ((typeof item.vbr !== 'undefined') && (item.vbr !== false)){
        message = 'VBR';
    } else {
        if (
            (typeof item.bitrate === 'undefined') ||
            (item.bitrate === false)
        ){
            if ('size' in item){
                if ('tag_version' in item && (
                    item.tag_version == 'ID3v2.2' ||
                    item.tag_version == 'ID3v2.3' ||
                    item.tag_version == 'ID3v2.4'
                )){
                    item.bitrate =
                        mod.calc_bitrate_classic(item.size - item.tag_length - 10,
                            item.vk_duration);
                } else
                    item.bitrate = item.bitrate__classic;
            } else
                item.bitrate = false;
        }

        message = item.bitrate || '…';
    }

    kenzo.class(item.dom_element, 'kz-bitrate', mod.audio_item_classes);
    item.dom_bitrate.setAttribute('data-message', message);
    item.dom_carousel.setAttribute('href', item.url_clean);
    item.dom_carousel.setAttribute('download', item.vk_name + '.mp3');

    var bitrate_classes = [
        'kz-vk-audio__bitrate--320',
        'kz-vk-audio__bitrate--256',
        'kz-vk-audio__bitrate--196',
        'kz-vk-audio__bitrate--128',
        'kz-vk-audio__bitrate--crap'];

    if (item.bitrate >= 288)
        kenzo.class(item.dom_carousel, 'kz-vk-audio__bitrate--320', bitrate_classes);
    else if (item.bitrate >= 224)
        kenzo.class(item.dom_carousel, 'kz-vk-audio__bitrate--256', bitrate_classes);
    else if (item.bitrate >= 176)
        kenzo.class(item.dom_carousel, 'kz-vk-audio__bitrate--196', bitrate_classes);
    else if (item.bitrate >= 112)
        kenzo.class(item.dom_carousel, 'kz-vk-audio__bitrate--128', bitrate_classes);
    else
        kenzo.class(item.dom_carousel, 'kz-vk-audio__bitrate--crap', bitrate_classes);
}

mod.update_button__download_progress = function(item){
    if (item.progress === null){
        kenzo.class(item.dom_element, 'kz-bitrate', mod.audio_item_classes);
    } else {
        item.dom_progress__filling.style.left = -100 + item.progress + '%';
        //item.dom_progress.setAttribute('data-progress', item.progress + '%');

        if (!item.dom_element.classList.contains('kz-progress'))
            kenzo.class(item.dom_element, 'kz-progress', mod.audio_item_classes);
    }
}

mod.update_button = function(item, changes){
    //console.log(item, changes);

    if (!item.available){
        kenzo.class(item.dom_element, 'kz-unavailable', mod.audio_item_classes);
        return false;
    }

    if (
        (changes.indexOf('dom_wrapper') > -1) ||
        (changes.indexOf('dom_carousel') > -1) ||
        (changes.indexOf('vbr') > -1) ||
        (changes.indexOf('bitrate') > -1) ||
        (changes.indexOf('tag_version') > -1) ||
        (changes.indexOf('error') > -1)
    ){
        mod.update_button__basic(item);
    }

    if (changes.indexOf('progress') > -1){
        mod.update_button__download_progress(item);
    }

};

})(kzvk);
