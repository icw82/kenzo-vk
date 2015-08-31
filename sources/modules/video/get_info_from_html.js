(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

// TODO: html5
mod.get_info_from_html = function(element){
    var _ = {
            available: true,
            dom_element: element,
            formats: [],
            player: (function(){
                if (element.type == 'application/x-shockwave-flash')
                    return 'flash';
                else if (element.getAttribute('id') === 'html5_player')
                    return 'html5';
                else
                    return false;
            })()
        }

    if (_.player === 'flash') {
        var data = element.getAttribute('flashvars');

        if (!data) {
            _.available = false;
            return _;
        }

        data = data.split('&');

        each (data, function(item){
            var pair = item.split('='),
                matches = pair[0].match(/url(\d+)/);

            if (matches){
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
                _.title = decodeURIComponent(pair[1])
            } else if (pair[0] == 'oid'){
                _.owner_id = decodeURIComponent(pair[1])
//            } else if (pair[0] == 'uid'){
//                _.uid = decodeURIComponent(pair[1])
            } else if (pair[0] == 'vid'){
                _.vid = decodeURIComponent(pair[1])
//            } else if (pair[0] == 'hash'){
//                _.hash = decodeURIComponent(pair[1])
//            } else if (pair[0] == 'hash2'){
//                _.hash2 = decodeURIComponent(pair[1])
            }

            _.id = _.owner_id + '_' + _.vid;

        });

    } else if (_.player === 'html5') {
        var video = _.dom_element.querySelector('video');
        var src = video.getAttribute('src');
        var matches = src.match(/(https?:\/\/.+?\.)(\d+)(\.)(mp4)(\?.+)/);
        var url = {
            first_part: matches[1],
            format: matches[2],
            // dot
            ext: matches[4],
            extra: matches[5]
        }

        _.owner = (function() {
            var element = _.dom_element.querySelector('#video_author');
            if (element instanceof Element)
                return element.innerHTML;
            else
                return null;
        })();

        _.title = (function() {
            var element = _.dom_element.querySelector('#video_title');
            if (element instanceof Element)
                return element.innerHTML;
            else
                return null;
        })();

        // TODO: Идентификаторы

        //console.log('+', html5video);

        // Форматы
        var quality_panel = _.dom_element.querySelector('#quality_panel');
        each (quality_panel.querySelectorAll('button'), function(item) {
            var value = item.getAttribute('value');


            var format = {
                'host': _,
                'format': value.replace(/(\d+)\w*/, '$1')
            }

            format.url = url.first_part + format.format + '.' + url.ext;
            format.ext = url.ext;

            _.formats.push(format);
        });


    } else
        _.available = false;

    return _;
}

})(kzvk);
