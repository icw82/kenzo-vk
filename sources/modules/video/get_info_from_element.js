(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.get_info_from_element = function(element) {
    var _ = {
        available: true,
        dom_element: element,
        formats: []
    }

    var data = element.getAttribute('flashvars');

    if (!data) {
        _.available = false;
        return _;
    }

    data = data.split('&');

    each (data, function(item){
        var pair = item.split('='),
            matches = pair[0].match(/url(\d+)/);

        if (matches) {
            var format = {
                'host': _,
                'format': parseInt(matches[1]),
                'url': decodeURIComponent(pair[1])
            }

            format.ext = format.url.match(/\.(\w+?)\?/)[1];
            _.formats.push(format);

        } else if (pair[0] == 'md_author'){
            _.owner = decodeURIComponent(pair[1])
        } else if (pair[0] == 'md_title'){
            _.title = kzvk.name_filter(decodeURIComponent(pair[1]))
        } else if (pair[0] == 'oid'){
            _.owner_id = decodeURIComponent(pair[1])
        } else if (pair[0] == 'uid'){
            _.uid = decodeURIComponent(pair[1])
        } else if (pair[0] == 'vid'){
            _.vid = decodeURIComponent(pair[1])
        } else if (pair[0] == 'hash'){
            _.hash = decodeURIComponent(pair[1])
        } else if (pair[0] == 'hash2'){
            _.hash2 = decodeURIComponent(pair[1])
        }

        _.id = _.owner_id + '_' + _.vid;

    });


    return _;
}

})(kzvk);
