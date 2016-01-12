mod.update_button = function(item) {
    if (!item.available) {
        kk.class(item.dom.element, 'kz-unavailable', mod.audio_item_classes);
        return false;
    }

    var message = ' ';

    item.bitrate__classic = mod.calc_bitrate_classic(item.size, item.vk_duration);
    item.bitrate__average = Math.floor(item.size * 8 / item.vk_duration / 1000);

    if ((typeof item.vbr !== 'undefined') && (item.vbr !== false)) {
        message = 'VBR';
    } else {
        if (
            (typeof item.bitrate === 'undefined') ||
            (item.bitrate === false)
        ) {
            if ('size' in item) {
                if ('tag_version' in item && (
                    item.tag_version == 'ID3v2.2' ||
                    item.tag_version == 'ID3v2.3' ||
                    item.tag_version == 'ID3v2.4'
                )) {
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

    kk.class(item.dom.element, 'kz-bitrate', mod.audio_item_classes);
    item.dom.bitrate.setAttribute('data-message', message);
    item.dom.carousel.setAttribute('href', item.url_clean);
    item.dom.carousel.setAttribute('download', item.vk_name + '.mp3');

    function filesize(size) {
        var output;
        var units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ']; // FUTURE: i18n

        each (units, function(unit, index) {
            var limit = Math.pow(10, 3 * (index + 1));

            if (size < limit * 0.8) {
                if (size < limit * 0.02)
                    output = Math.round(size / limit * 10000) / 10
                else
                    output = Math.round(size / limit * 1000);

                output = output.toLocaleString();
                output += ' ' + unit;
                return true;
            }
        });

        return output;
    }

    if (typeof item.size === 'number')
        item.dom.carousel.setAttribute('title', filesize(item.size));

    var bitrate_classes = [
        'kz-vk-audio__bitrate--320',
        'kz-vk-audio__bitrate--256',
        'kz-vk-audio__bitrate--196',
        'kz-vk-audio__bitrate--128',
        'kz-vk-audio__bitrate--crap'];

    if (item.bitrate >= 288)
        kk.class(item.dom.carousel, 'kz-vk-audio__bitrate--320', bitrate_classes);
    else if (item.bitrate >= 224)
        kk.class(item.dom.carousel, 'kz-vk-audio__bitrate--256', bitrate_classes);
    else if (item.bitrate >= 176)
        kk.class(item.dom.carousel, 'kz-vk-audio__bitrate--196', bitrate_classes);
    else if (item.bitrate >= 112)
        kk.class(item.dom.carousel, 'kz-vk-audio__bitrate--128', bitrate_classes);
    else
        kk.class(item.dom.carousel, 'kz-vk-audio__bitrate--crap', bitrate_classes);
}

mod.update_button__download_progress = function(item) {
    if (item.progress === null) {
        kk.class(item.dom.element, 'kz-bitrate', mod.audio_item_classes);
    } else {
        item.dom.progress__filling.style.left = -100 + item.progress + '%';
        //item.dom.progress.setAttribute('data-progress', item.progress + '%');

        if (!item.dom.element.classList.contains('kz-progress'))
            kk.class(item.dom.element, 'kz-progress', mod.audio_item_classes);
    }
}
