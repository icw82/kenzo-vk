(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.update_button = function(item, changes){
    //console.log(item);

    if (!item.available){
        kenzo.toggle_class(item.dom_element, 'kz-unavailable', mod.audio_item_classes, false);
        return false;
    }

    var message = ' ';

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
                    item.bitrate = mod.calc_bitrate_classic(item.size, item.vk_duration);
            } else {
                item.bitrate = false;
            }
        }

        message = item.bitrate || '—';
    }

    kenzo.toggle_class(item.dom_element, 'kz-bitrate', mod.audio_item_classes, false);
    item.dom_bitrate.setAttribute('data-message', message);

    var bitrate_classes = [
        'kz-vk-audio__bitrate--320',
        'kz-vk-audio__bitrate--256',
        'kz-vk-audio__bitrate--196',
        'kz-vk-audio__bitrate--128',
        'kz-vk-audio__bitrate--crap'];

    if (item.bitrate >= 288)
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-audio__bitrate--320', bitrate_classes, false);
    else if (item.bitrate >= 224)
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-audio__bitrate--256', bitrate_classes, false);
    else if (item.bitrate >= 176)
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-audio__bitrate--196', bitrate_classes, false);
    else if (item.bitrate >= 112)
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-audio__bitrate--128', bitrate_classes, false);
    else
        kenzo.toggle_class(item.dom_carousel,
            'kz-vk-audio__bitrate--crap', bitrate_classes, false);

};

})(kzvk);
