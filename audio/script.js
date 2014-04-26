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

function calc_bitrate_classic(size, duration){
    // Its mutherfucking classic
    var kbps = Math.floor(size * 8 / duration / 1000);

    if ((kbps >= 288)) kbps = 320; else
    if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
    if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
    if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
    if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
    if ((kbps >= 80 ) && (kbps < 112)) kbps = 96; else
    if ((kbps >= 48 ) && (kbps < 80 )) kbps = 64; else
    if ((kbps >= 20 ) && (kbps < 48 )) kbps = 32;

    return kbps;
}

function get_mp3_first_frame_info(url, offset, callback){
/*
    var
        xhr = new XMLHttpRequest(),
        data = {};

    xhr.onreadystatechange = function(){
        if ((xhr.readyState === 4) && (xhr.status === 206)){

            console.log(this.getResponseHeader('Content-Range'));

            var buffer = this.response;
            var int = new Int8Array(buffer);
            console.log(int);
        }
    }

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Range', 'bytes=' + offset + '-' + (offset + 4));
    xhr.responseType = 'arraybuffer';
    xhr.send(null);

    //console.log('get_mp3_first_frame_info');
*/
    callback();
}


function get_mp3_info(url, callback){
    if (typeof callback != 'function'){
        console.warn('KZVK: get_mp3_info: callback не функция');
        return false;
    }

    var
        xhr = new XMLHttpRequest(),
        data = {
            'available': true
        };

    xhr.onreadystatechange = function(){
        if (xhr.readyState !== 4) return false;

        if (xhr.status === 206){
            if (this.getResponseHeader('Content-Type') != 'audio/mpeg'){
                console.log('KZVK: get_mp3_info:', 'не «audio/mpeg»');
                callback(data);
                return false;
            }

            var buffer = this.response;

            // Размер файла
            data.size = (function(range){
                var out = range.match(/\d+?$/);
                if (out && out[0])
                    return out[0];
                else
                    return false;
            })(this.getResponseHeader('Content-Range'));

            if (!data.size){
                callback(data);
                return false;
            }

            // Версия тега
            data.tag_version = (function(buffer){
                var identifier = new Int8Array(buffer, 0, 3);
                identifier = String.fromCharCode(identifier[0], identifier[1], identifier[2]);

                if (identifier == 'ID3'){
                    var version = new Int8Array(buffer, 3, 1);
                    return 'ID3v2.' + version[0];
                } else {
                    //console.log('KZVK: get_mp3_info:', 'not ID3v2');
                    return false;
                }
            })(buffer);

            if (!data.tag_version){
                callback(data);
                return false;
            }

            // Длина тега
            data.tag_length = (function(buffer){
                var length = new Int8Array(buffer, 6, 4);

                return length[3] & 0x7f
                    | ((length[2] & 0x7f) << 7)
                    | ((length[1] & 0x7f) << 14)
                    | ((length[0] & 0x7f) << 21);
            })(buffer);

            // Первый фрейм
            get_mp3_first_frame_info(url, data.tag_length, function(){

                callback(data);
            });
        } else {
            data.available = false;
            callback(data);
        }
    }

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Range', 'bytes=0-9');
    xhr.responseType = 'arraybuffer';
    xhr.send(null);
}


function save(url, name, element){
    (name) || (name = 'kenzo-vk-audio.mp3');

    var
        xhr = new XMLHttpRequest(),
        progress = 0,
        abort = false,
        DOM_kz__carousel =
            element.querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate =
            element.querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__progress =
            element.querySelector('.kz-vk-audio__carousel__item.kz-progress'),
        DOM_kz__progress_filling =
            element.querySelector('.kz-vk-audio__progress-filling');

    function show_progress_bar(){
        console.log('----show');
        if (!DOM_kz__carousel.classList.contains('kz-progress'))
            DOM_kz__carousel.classList.add('kz-progress');

        if (DOM_kz__carousel.classList.contains('kz-bitrate'))
            DOM_kz__carousel.classList.remove('kz-bitrate');
    }

    function hide_progress_bar(){
        if (!DOM_kz__carousel.classList.contains('kz-bitrate'))
            DOM_kz__carousel.classList.add('kz-bitrate');

        if (DOM_kz__carousel.classList.contains('kz-progress'))
            DOM_kz__carousel.classList.remove('kz-progress');
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
        id = element.querySelector('a:first-child').getAttribute('name'),
        info = element.querySelector('#audio_info' + id).value.split(','),
        url = info[0],
        duration = info[1],
        artist, title,
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

    function validate_data(data){
        if (typeof data !== 'object'){
            console.warn('KZVK: createButton: неправильный формат данных');
            data = {};
            //return;
        }

        if (!('bitrate' in data)){
            if ('size' in data){
                if ('tag_version' in data && (
                    data.tag_version == 'ID3v2.2' ||
                    data.tag_version == 'ID3v2.3' ||
                    data.tag_version == 'ID3v2.4'
                )){
                    data.bitrate =
                        calc_bitrate_classic(data.size - data.tag_length - 10, duration);
                } else
                    data.bitrate = calc_bitrate_classic(data.size, duration);
            } else
                data.bitrate = false;
        }

        return data;
    }

    function createButton(data){
        if (element.classList.contains('kz-vk-audio__finished')) return false;

        var DOM_kz__wrapper = document.createElement('div');
        DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

        DOM_kz__wrapper.innerHTML =
            '<div class="kz-vk-audio__carousel">' +
                '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
                '<div class="kz-vk-audio__carousel__item kz-progress">' +
                    '<div class="kz-vk-audio__progress-filling"></div>' +
                '</div>' +
                '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
            '</div>';

        var
            DOM_kz__carousel = DOM_kz__wrapper
                .querySelector('.kz-vk-audio__carousel'),
            DOM_kz__bitrate = DOM_kz__wrapper
                .querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
            DOM_kz__unavailable = DOM_kz__wrapper
                .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');

        if (data.available){
            DOM_kz__carousel.classList.add('kz-bitrate');

            DOM_kz__bitrate.addEventListener('click', function(event){
                stopEvent(event);
                save(url, artist + ' — ' + title + '.mp3', DOM_kz__wrapper);
            }, false)

            DOM_kz__bitrate.setAttribute('data-bitrate', data.bitrate || '??');

            if (data.bitrate >= 288)
                DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--320');
            else if (data.bitrate >= 224)
                DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--256');
            else if (data.bitrate >= 176)
                DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--196');
            else if (data.bitrate >= 112)
                DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--128');
            else
                DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--crap');

        } else {
            DOM_kz__carousel.classList.add('kz-unavailable');
            DOM_kz__unavailable.addEventListener('click', stopEvent, false);

        }

        if (DOM_play.nextSibling)
            DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
        else
            DOM_play.parentElement.appendChild(DOM_kz__wrapper);

        element.classList.add('kz-vk-audio__finished');
    }

    if (!url || url == ""){
        createButton({
            'available': false
        });

        return false;
    }

/*
    get_mp3_info(url, function(data){
        createButton(validate_data(data));
    });
//*/

    (function(){
        var
            db = null,
            dbName = 'audio',
            dbVersion = 2,
            store = null,
            storeName = 'bitrate';

        var connect = function(callback){
            var request = indexedDB.open(dbName, dbVersion);

            request.onupgradeneeded = function(event){
                if (event.target.result.objectStoreNames.contains(storeName)){
                    event.target.result.deleteObjectStore(storeName);
                    console.log('KZVK:', 'Объект удалён');
                }

                store = event.target.result.createObjectStore(storeName, {keyPath: 'id'});
            }

            request.onsuccess = function(){
                db = request.result;
                callback(db);
            }

            request.onerror = function(){
                console.log('KZVK:', 'Сonnect error:', event);
            }

        }

        connect(function(db){
            var request = db.transaction([storeName], 'readonly')
                .objectStore(storeName)
                .get(id);

            request.onsuccess = function(event){
                if (event.target.result){
                    var data = {
                        'available': true,
                        'bitrate': event.target.result.bitrate
                    }

                    createButton(data);
                } else {
                    get_mp3_info(url, function(data){
                        var valid_data = validate_data(data);
                        createButton(valid_data);

                        connect(function(db){
                            var request = db.transaction([storeName], 'readwrite')
                                .objectStore(storeName)
                                .add({
                                    'id': id,
                                    'bitrate': valid_data.bitrate
                                });

                            request.onsuccess = function(){
                                db.close();
                            }

                            request.onerror = function(){
                                console.warn('KZVK: cache-add:', event);
                                db.close();
                            }
                        });

                    })
                }
            }

            request.onerror = function(){
                console.log('KZVK:', 'connect.onerror:', event);

                get_mp3_info(url, function(data){
                    createButton(validate_data(data));
                });
            }
        });

    })();
//*/
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

})();
