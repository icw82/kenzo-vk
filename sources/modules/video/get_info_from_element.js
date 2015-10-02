(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.get_info_from_element = function(element) {
    var info = new mod.Video;

    info.dom_element = element;

    var data = element.getAttribute('flashvars');

    if (!data)
        return info;
    else
        info.available = true;

    data = data.split('&');

    each (data, function(item){
        var pair = item.split('='),
            matches = pair[0].match(/url(\d+)/);

        if (matches) {
            var format = new mod.Format(info);

            format.format = parseInt(matches[1]);
            format.url = decodeURIComponent(pair[1]);

            info.formats.push(format);

        } else if (pair[0] == 'md_author') {
            info.owner = decodeURIComponent(pair[1])
        } else if (pair[0] == 'md_title') {
            info.title = decodeURIComponent(pair[1])
        } else if (pair[0] == 'oid') {
            info.owner_id = decodeURIComponent(pair[1])
        } else if (pair[0] == 'uid') {
            info.uid = decodeURIComponent(pair[1])
        } else if (pair[0] == 'vid') {
            info.vid = decodeURIComponent(pair[1])
        } else if (pair[0] == 'hash') {
            info.hash = decodeURIComponent(pair[1])
        } else if (pair[0] == 'hash2') {
            info.hash2 = decodeURIComponent(pair[1])
        }

    });

    mod.log(info);

    return info;
}

})(kzvk);
