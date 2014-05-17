//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
(function(){

'use strict';

function init(options){
    if (options.video__direct_links !== true) return false;

    var DOM_body = document.querySelector('body');
    DOM_body.classList.add('kz-vk-video');

    var DOM_body_observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (!DOM_body.classList.contains('kz-vk-video'))
                DOM_body.classList.add('kz-vk-video');
        });
    });

    function get_video_info(element){
        var
            vars = {},
            urls = [],
            data = element.getAttribute('flashvars');

        if (!data) return false;

        data = data.split('&');
        each(data, function(item){
            var
                pair = item.split('='),
                matches = pair[0].match(/url(\d+)/);

            vars[pair[0]] = decodeURIComponent(pair[1]);

            if (matches) urls.push({
                'quality': parseInt(matches[1]),
                'url': vars[pair[0]]
            })

        })

        var DOM_host = document.querySelector('#mv_controls_line');
        console.log(DOM_host);
        if (!(DOM_host instanceof Element)) return false;

        // Создание области
        var DOM_kz__wrapper = document.createElement('span');
        DOM_kz__wrapper.classList.add('kz-vk-video__wrapper');
        var links = [];

        each(urls, function(item){
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

    each(document.querySelectorAll('#video_player'), function(item){
        get_video_info(item);
    });

    document.addEventListener('DOMNodeInserted', function(event){
        if (event.target instanceof Element){
            if (event.target.getAttribute('id') == 'video_player'){
                get_video_info(event.target)
            }
        }
    });

}

if (document.readyState === 'complete'){
    chrome.storage.sync.get(default_options, function(items){
        init(items);
    });
} else (function(){
    function on_load(){
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        chrome.storage.sync.get(default_options, function(items){
            init(items);
        });
    }

    document.addEventListener('DOMContentLoaded', on_load, false );
    window.addEventListener('load', on_load, false );
})();

})();
