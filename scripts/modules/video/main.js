(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'video',
    version: '1.0.0'
};

mod.get_video_info = function(element){
    var vars = {},
        urls = [],
        data = element.getAttribute('flashvars');

    if (!data) return false;

    data = data.split('&');
    each (data, function(item){
        var pair = item.split('='),
            matches = pair[0].match(/url(\d+)/);

        vars[pair[0]] = decodeURIComponent(pair[1]);

        if (matches) urls.push({
            'quality': parseInt(matches[1]),
            'url': vars[pair[0]]
        })

    })

    var DOM_host = document.querySelector('#mv_controls_line');
    if (!(DOM_host instanceof Element)) return false;

    // Создание области
    var DOM_kz__wrapper = document.createElement('span');
    DOM_kz__wrapper.classList.add('kz-vk-video__wrapper');
    var links = [];

    each (urls, function(item){
        links.push('<a class="kz-vk-video__link" href="'
            + item.url + '">' + item.quality +'</a>');
    });

    DOM_kz__wrapper.innerHTML = '<span id="mv_add_divider" class="divider">|</span>'
        + 'Ссылки для скачивания: '
        + links.join(', ');

    DOM_host.appendChild(DOM_kz__wrapper);

    //console.log(urls);
    //return vars;

}

mod.init = function(){
    if (kzvk.options.video__direct_links !== true) return false;

    mod.dom = {
        body: document.querySelector('body')
    };

    kzvk.class_forever('kz-vk-video', mod.dom.body);

    each (document.querySelectorAll('#video_player'), function(item){
        mod.get_video_info(item);
    });

    document.addEventListener('DOMNodeInserted', function(event){
        if (event.target instanceof Element){
            if (event.target.getAttribute('id') == 'video_player'){
                mod.get_video_info(event.target)
            }
        }
    });
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
