(function(){

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
    //event.returnValue = false;
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
    var
        xhr = new XMLHttpRequest(),
        id = element.querySelector('a:first-child').getAttribute('name'),
        info = element.querySelector('#audio_info' + id).value.split(','),
        url = info[0],
        duration = info[1],
        size, kbps, artist, title,
        DOM_title_wrap = element.querySelector('.title_wrap');

    artist = DOM_title_wrap.querySelector('b > a').textContent;
    title = DOM_title_wrap.querySelector('.title').textContent;
    artist = artist.replace(/^s+|\s+$/g, '');
    title = title.replace(/^s+|\s+$/g, '');

    xhr.onreadystatechange = function(){
        if ((xhr.readyState === 4) && (xhr.status === 200)){
            size = this.getResponseHeader('Content-Length');
            kbps = Math.floor(size * 8 / duration / 1000);

            var
                DOM_duration = element.querySelector('.duration'),
                DOM_actions = element.querySelector('.actions');

            // Битрейт
            var DOM_stats = document.createElement('span');

            DOM_stats.classList.add('kz-vk-audio__stats');
            DOM_stats.innerHTML = ' <small>' + kbps + ' kbps</small>'

            DOM_title_wrap.appendChild(DOM_stats);

            // Кнопка
            var DOM_download = document.createElement('div');

//            setInterval(function(){
//                console.log('rowActive' in Audio);
//            }, 3000)
            /*
            DOM_download.addEventListener('mouseover', function(){
                console.log(window);
                //showTooltip(this, {text: 'Скачать', showdt: 0, black: 1, shift: [9, 5, 0]});
            }, true)*/

            //DOM_download.setAttribute('onmouseover', 'update(window);');
            DOM_download.setAttribute('onmouseover', 'Audio.rowActive(this, "Скачать", [9, 5, 0]);');
            DOM_download.setAttribute('onmouseout', 'Audio.rowInactive(this)');


            DOM_download.classList.add('kz-vk-audio__download');
            DOM_download.classList.add('fl_r');
            DOM_download.innerHTML = '<div class="kz-vk-audio__download__btn"></div>'

            //DOM_actions.insertBefore(DOM_download, DOM_actions.firstChild);
            DOM_actions.appendChild(DOM_download);

            DOM_download.addEventListener('click', function(event){
                stopEvent(event);
                save(url, artist + ' — ' + title + '.mp3');
            }, false)
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
