(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.get_info_from_object = function(object, element) {
    var info = new mod.Video;

    if (typeof object.vid !== 'number')
        return info;
    else
        info.available = true;

    info.vid = object.vid,
    info.owner = object.md_author,
    info.owner_id = object.oid,
    info.uid = object.uid,
    info.title = object.md_title,

    info.hash = object.hash,
    info.hash2 = object.hash2,

    info.dom_element = element;

    // Форматы
    for (var key in object) {
        let matches = key.match(/^url(\d{3,4})$/);

        if (matches) {
            var format = new mod.Format(info);

            format.format = matches[1];
            format.url = object[key];

            info.formats.push(format);
        }
    }

    mod.log(info);

    return info;
}

})(kzvk);
