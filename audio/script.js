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

function save(url, name, element){
    (name) || (name = 'kenzo-vk-audio.mp3');

    var
        xhr = new XMLHttpRequest(),
        progress = 0,
        abort = false,
        DOM_kz__btn =
            element.querySelector('.kz-vk-audio__btn'),
        DOM_kz__progress =
            element.querySelector('.kz-vk-audio__progress'),
        DOM_kz__progress_filling =
            element.querySelector('.kz-vk-audio__progress-filling');

    function show_progress_bar(){
        if (!DOM_kz__btn.classList.contains('kz-hidden'))
            DOM_kz__btn.classList.add('kz-hidden');

        DOM_kz__progress.classList.remove('kz-hidden');
    }

    function hide_progress_bar(){
        if (!DOM_kz__progress.classList.contains('kz-hidden'))
            DOM_kz__progress.classList.add('kz-hidden');

        DOM_kz__btn.classList.remove('kz-hidden');
    }

    DOM_kz__progress.addEventListener('click', function(event){
        stopEvent(event);
        xhr.abort();
        abort = true;
        hide_progress_bar();
    }, false);

    xhr.responseType = 'blob';
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 1)
            show_progress_bar();
/*
        if ((xhr.readyState === 4) && (xhr.status === 200)){

        }
*/
    }

    xhr.onprogress = function(progress){
        if (progress.lengthComputable && !abort){
            show_progress_bar();
            progress = Math.floor(progress.loaded / progress.total * 100);
            DOM_kz__progress_filling.style.left = -100 + progress + '%';
            //DOM_kz__progress.setAttribute('data-progress', progress + '%');
        }
    }
    xhr.onload = function(){
        var blob = new window.Blob([this.response], {'type': 'audio/mpeg'});
        saveAs(blob, name);
        hide_progress_bar();
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

    DOM_body_observer.observe(DOM_body, {attributes: true /*MutationObserverInit*/});
    //DOM_body_observer.disconnect();

    each(document.querySelectorAll('.audio'), process);

    // при вставке новых элементов
    document.addEventListener('DOMNodeInserted', function(event){

        if ('classList' in event.target){
            if (event.target.classList.contains('audio')){
                process(event.target);
                return true;
            }

            if (event.target.classList.contains('area')){
                console.log(event.target);
                console.log(event.target.parentElement);

                if (event.target.parentElement.classList.contains('audio')){
                    event.target.parentElement.classList.remove('kz-vk-audio__finished');
                    process(event.target.parentElement);
                    return true;
                }
            }

            if ('classList' in event.target){
                each(event.target.querySelectorAll('.audio'), process);
                return true;
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
    var type;

    if (element.classList.contains('kz-vk-audio__finished')) return false;

    if (element.parentElement.getAttribute('id') === 'initial_list')
        type = 'default';
    else if (element.parentElement.getAttribute('id') === 'search_list')
        type = 'default';
    else if (element.parentElement.classList.contains('audio_results'))
        type = 'search_audio';
    else if (element.parentElement.parentElement.classList.contains('show_media'))
        type = 'search';
    else if (element.parentElement.getAttribute('id') === 'pad_playlist')
        type = 'pad';
    else if (element.parentElement.classList.contains('wall_audio'))
        type = 'wall';

    if (!type) return false;

    var
        xhr = new XMLHttpRequest(),
        id = element.querySelector('a:first-child').getAttribute('name'),
        info = element.querySelector('#audio_info' + id).value.split(','),
        url = info[0],
        duration = info[1],
        size, kbps, artist, title,
        DOM_area = element.querySelector('.area');

    if ((type === 'default') || (type === 'pad')){
        var DOM_play = DOM_area.querySelector('.play_btn')
    }

    if ((type === 'wall') || (type === 'search_audio') || (type === 'search')){
        var DOM_play = DOM_area.querySelector('.play_btn_wrap');
    }

    var
        DOM_info = DOM_area.querySelector('.info'),
        DOM_title_wrap = DOM_info.querySelector('.title_wrap');

    artist = DOM_title_wrap.querySelector('b > a').textContent;
    title = DOM_title_wrap.querySelector('.title').textContent;
    artist = artist.replace(/^s+|\s+$/g, '');
    title = title.replace(/^s+|\s+$/g, '');

    xhr.onreadystatechange = function(){
        if (element.classList.contains('kz-vk-audio__finished')) return false;

        if ((xhr.readyState === 4) && (xhr.status === 200)){
            //var fragment = document.createDocumentFragment();
            var DOM_kz__wrapper = document.createElement('div');
            DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

            DOM_kz__wrapper.innerHTML =
                '<div class="kz-vk-audio__btn"></div>' +
                '<div class="kz-vk-audio__progress kz-hidden">' +
                    '<div class="kz-vk-audio__progress-filling"></div>'+
                '</div>';

            var DOM_kz__btn = DOM_kz__wrapper.querySelector('.kz-vk-audio__btn');

            DOM_kz__btn.addEventListener('click', function(event){
                stopEvent(event);
                save(url, artist + ' — ' + title + '.mp3', DOM_kz__wrapper);
            }, false)

            size = this.getResponseHeader('Content-Length');
            kbps = Math.floor(size * 8 / duration / 1000);

            if ((kbps >= 288)) kbps = 320; else
            if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
            if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
            if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
            if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
            if ((kbps >= 80 ) && (kbps < 112)) kbps = 96; else
            if ((kbps >= 48 ) && (kbps < 80 )) kbps = 64; else
            if ((kbps >= 20 ) && (kbps < 48 )) kbps = 32;

            var
                DOM_duration = element.querySelector('.duration'),
                DOM_actions = element.querySelector('.actions');

            DOM_kz__btn.setAttribute('data-kbps', kbps);

            if (kbps >= 288)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--320');
            else if (kbps >= 224)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--256');
            else if (kbps >= 176)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--196');
            else if (kbps >= 112)
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--128');
            else
                DOM_kz__btn.classList.add('kz-vk-audio__bitrate--crap');

            if (DOM_play.nextSibling)
                DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
            else
                DOM_play.parentElement.appendChild(DOM_kz__wrapper);

            element.classList.add('kz-vk-audio__finished');
        }
    }

    xhr.open('HEAD', url, true);
    xhr.send(null);
}


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

/*
var bitrate_cache = {
    db: null,
    dbName: 'audio',
    dbVersion: 1,
    store: null,
    storeName: 'bitrate',

    connect: function(callback){
        var
            self = this,
            request = indexedDB.open(self.dbName, self.dbVersion);

        request.onupgradeneeded = function(event){
            self.store = event.target.result.createObjectStore(self.storeName, {keyPath: 'id'});
        }

        request.onsuccess = function(){
            self.db = request.result;
            callback(self.db);
        }

        request.onerror = function(){
            console.log('Сonnect error: ', event);
        }
    },

    get: function(id){
        var
            self = this,
            test = null;

        self.connect(function(db){
            var request = db.transaction([self.storeName], 'readwrite')
                .objectStore(self.storeName)
                .get(id);

            request.onsuccess = function(event){
                //test();
                console.log('add.onsuccess: ', event.target.result);
            }

            request.onerror = function(){
                console.log('add.onerror: ', event);
            }
        });

        return {
            success: function(callback){
                callback();
                return this;
            },
            error: function(callback){
                callback();
                return this;
            }
        }
    },

    add: function(id, bitrate){
        var self = this;

        self.connect(function(db){
            var request = db.transaction([self.storeName], 'readwrite')
                .objectStore(self.storeName)
                .add({
                    'id': id,
                    'bitrate': bitrate
                });

            request.onsuccess = function(){
                console.log('add.onsuccess: ', request.result);
            }

            request.onerror = function(){
                console.log('add.onerror: ', event);
            }
        });
    },

    reset: function(){
        indexedDB.deleteDatabase(self.dbName);
    }
}

//bitrate_cache.add('11_144', 320);
bitrate_cache
    .get('11_144')
    .success(function(){
        console.log('****OK');
    })
    .error(function(){
        console.log('****ERROR');
    });
*/

})();
