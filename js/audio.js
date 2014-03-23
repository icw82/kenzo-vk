(function(){

'use strict';

function each(array, callback){
    for (var i = 0; i < array.length; i++){
        callback(array[i]);
    }
}

function init(){

    var audio = document.querySelectorAll('.audio');

    each(audio, process);

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
        http = new XMLHttpRequest(),
        id = element.querySelector('a:first-child').getAttribute('name'),
        info = element.querySelector('#audio_info' + id).value.split(','),
        url = info[0],
        duration = info[1],
        size, kbps;

    http.onreadystatechange = function(){
        if ((http.readyState === 4) && (http.status === 200)){
            size = this.getResponseHeader('Content-Length');
            kbps = Math.floor(size * 8 / duration / 1000);

            var
                DOM_stats = document.createElement('span'),
                DOM_duration = element.querySelector('.duration');

            DOM_stats.classList.add('kz-vk-audio__stats');
            DOM_stats.innerHTML = '<small>' + kbps + ' kbps</small>'

            element.querySelector('.title_wrap').appendChild(DOM_stats);
        }
    }

    http.open('HEAD', url, true);
    http.send(null);
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
