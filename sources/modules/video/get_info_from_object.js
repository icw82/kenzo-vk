(function(kzvk){
'use strict';

var mod = kzvk.modules.video;


mod.get_info_from_object = function(object, element) {
    if (typeof object.vid !== 'number')
        return {
            available: false
        };

    var _ = {
        available: true,
        formats: [],
        vid: object.vid,
        owner: object.md_author,
        owner_id: object.oid,
        uid: object.uid, // В чём отличие от OID?
        title: kzvk.name_filter(object.md_title),

        hash: object.hash,
        hash2: object.hash2,

        dom_element: element, // NOTE: Нужен ли передаваемый элемент?
    }

     _.id = _.owner_id + '_' + _.vid;

    // Форматы
    for (var key in object) {
        let matches = key.match(/^url(\d{3,4})$/);

        if (matches) {
            _.formats.push({
                'host': _,
                'format': matches[1],
                'url': object[key],
                'ext': object[key].match(/\.(\w+?)\?/)[1]
            });
        }
    }

    return _;
}

})(kzvk);
