(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

function each(array, callback){
    for (var i = 0; i < array.length; i++){
        callback(array[i]);
    }
}

function stopEvent(event){
    event = event || window.event;
    if (!event) return false;
    while (event.originalEvent){event = event.originalEvent}
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    return false;
}

function save(url, name){
    var xhr = new XMLHttpRequest();
    (name) || (name = 'kenzo-vk-audio.mp3');

    xhr.responseType = 'blob';
    xhr.onprogress = function(progress){
        if (progress.lengthComputable){
            console.log(progress.loaded + ' / ' + progress.total);
        }
    }
    xhr.onload = function(){
        var blob = new window.Blob([this.response], {'type': 'audio/mpeg'});
        saveAs(blob, name);
    }
    xhr.open('GET', url, true);
    xhr.send(null);
};

function init(){
    var DOM_body = document.querySelector('body');
    DOM_body.classList.add('kz-vk-audio');

    var DOM_body_observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if (!DOM_body.classList.contains('kz-vk-audio'))
                DOM_body.classList.add('kz-vk-audio');
        });
    });

    DOM_body_observer.observe(DOM_body, { attributes: true /*MutationObserverInit*/});
    //DOM_body_observer.disconnect();

    each(document.querySelectorAll('.audio'), process);

    // при вставке новых элементов
    document.addEventListener('DOMNodeInserted', function(event){
        if (('classList' in event.target) && event.target.classList.contains('audio')){
            process(event.target);
        } else {
            if ('classList' in event.target){
                each(event.target.querySelectorAll('.audio'), process);
            }
        }
    });

/*
    chrome.extension.onMessage.addListener(function (a, b, c) {
        console.log('onMessage***************');
    });

    chrome.extension.sendMessage({"command": "getOptions"}, function (opt){
        console.log('sendMessage***************');
        console.log(opt);
    })
*/
};

function process(element){
    if (element.classList.contains('kz-vk-audio__finished')) return false;

    var
        xhr = new XMLHttpRequest(),
        id = element.querySelector('a:first-child').getAttribute('name'),
        info = element.querySelector('#audio_info' + id).value.split(','),
        url = info[0],
        duration = info[1],
        size, kbps, artist, title,
        DOM_area = element.querySelector('.area'),
        DOM_play = DOM_area.querySelector('.play_btn'),
        DOM_info = DOM_area.querySelector('.info'),
        DOM_title_wrap = DOM_info.querySelector('.title_wrap');

    artist = DOM_title_wrap.querySelector('b > a').textContent;
    title = DOM_title_wrap.querySelector('.title').textContent;
    artist = artist.replace(/^s+|\s+$/g, '');
    title = title.replace(/^s+|\s+$/g, '');

    xhr.onreadystatechange = function(){
        if (element.classList.contains('kz-vk-audio__finished')) return false;

        if ((xhr.readyState === 4) && (xhr.status === 200)){
            var DOM_kz__wrapper = document.createElement('div');
            DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');
            var DOM_kz__btn = document.createElement('div');
            DOM_kz__btn.classList.add('kz-vk-audio__btn');

            DOM_kz__wrapper.appendChild(DOM_kz__btn);
/*
            DOM_kz__btn.setAttribute('onmouseover',
                'Audio.rowActive(this, "Скачать", [9, 5, 0]);');
            DOM_kz__btn.setAttribute('onmouseout',
                'Audio.rowInactive(this)');
*/
            DOM_kz__btn.addEventListener('click', function(event){
                stopEvent(event);
                save(url, artist + ' — ' + title + '.mp3');
            }, false)

            size = this.getResponseHeader('Content-Length');
            kbps = Math.floor(size * 8 / duration / 1000);

            var
                DOM_duration = element.querySelector('.duration'),
                DOM_actions = element.querySelector('.actions');

            DOM_kz__btn.setAttribute('data-kbps', kbps);

            if (kbps > 315)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--320');
            else if (kbps > 250)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--256');
            else if (kbps > 180)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--196');
            else if (kbps > 124)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--128');
            else if (kbps > 90)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--96');
            else
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--crap');

            DOM_area.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
            element.classList.add('kz-vk-audio__finished');
        }
    }

    xhr.open('HEAD', url, true);
    xhr.send(null);
}

// onload
if (document.readyState === 'complete'){
    init();
} else (function(){
    function on_load(){
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        init();
    }

    document.addEventListener('DOMContentLoaded', on_load, false );
    window.addEventListener('load', on_load, false );
})();

})();
