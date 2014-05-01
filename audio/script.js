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
        DOM_kz__carousel =
            element.querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate =
            element.querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__progress =
            element.querySelector('.kz-vk-audio__carousel__item.kz-progress'),
        DOM_kz__progress_filling =
            element.querySelector('.kz-vk-audio__progress-filling');

    function show_progress_bar(){
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


function get_binary_data_from_url(/* String url [, Array range], Function callback */){
    // Проверка
    if (typeof arguments[0] !== 'string'){
        console.warn('KZ: url не передан');
        return false;
    } else
        var url = arguments[0];

    if (arguments[1]){
        if (typeof arguments[1] == 'function'){
            var callback = arguments[1];
        } else if (arguments[1] instanceof Array){
            if (arguments[1][0] instanceof Array)
                var ranges = arguments[1];
            else
                var ranges = [arguments[1]];

            if (typeof arguments[2] == 'function')
                var callback = arguments[2];
            else {
                console.warn('KZ: Функция обратного вызова не передана');
                return false;
            }
        } else {
            console.warn('KZ: Второй аргумент не передан');
            return false;
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    if (!ranges) {
    // Передача файла полностью

    } else if (ranges.length === 1){
    // Передача файла одной части файла
        xhr.setRequestHeader('Range', 'bytes=' + ranges[0][0] + '-' + ranges[0][1]);

        xhr.onreadystatechange = function(){
            if (xhr.readyState !== 4) return false;
            if (xhr.status === 206){
                var self = this;
                callback([{
                    'headers': self.getAllResponseHeaders(),
                    'getHeader': function(header){
                        return self.getResponseHeader(header);
                    },
                    'content': self.response
                }]);
            } else {
                callback(false);
            }
        }

    } else {
    // Передача файла нескольких частей файла
        xhr.setRequestHeader('Range', 'bytes=' + (function(){
            ranges.forEach(function(element, index){
                ranges[index] = ranges[index][0] + '-' + ranges[index][1];
            })
            return ranges.join(',');
        })());

        xhr.onreadystatechange = function(){
            if (xhr.readyState !== 4) return false;
            if (xhr.status === 206){

                // Разделитель
                var separator = (function(range){
                    var out = range.match(/boundary=(.+)$/);
                    if (out && out[1])
                        return out[1];
                    else
                        return false;
                })(this.getResponseHeader('Content-Type'));

                // Части
                var parts = (function(response, separator){
                    var
                        ranges = [],
                        view = new Uint8Array(response),
                        out = [],
                        cur = 0;
// — — — — — — — — — — — — — — — indian Magic (рождённое в муках и бреду)
// Поиск начала данных раздела
while (cur < response.byteLength){
    if (view[cur] === 45 && view[cur + 1] === 45){
        cur += 2;
        for (var i = 0; i < separator.length; i++){
            if (separator.charCodeAt(i) === view[cur]){
                if (i == separator.length - 1){
                    cur++;
                    if (view[cur] === 13 && view[cur + 1] === 10){
                        cur += 2;
                        if (ranges.length > 0){
                            ranges[ranges.length - 1].end = cur - separator.length - 7;
                        }

                        ranges.push({headers: cur});

                        while (
                            cur < response.byteLength &&
                            !(view[cur + 2] === 45 && view[cur + 3] === 45)
                        ){
                            if (
                                view[cur] === 13 && view[cur + 1] === 10 &&
                                view[cur + 2] === 13 && view[cur + 3] === 10
                            ){
                                cur += 4;
                                break;
                            } else {
                                cur++;
                            }
                        }

                        if (cur !== response.byteLength - 1)
                            ranges[ranges.length - 1].begin = cur;

                    } else if (view[cur] === 45 && view[cur + 1] === 45){
                        ranges[ranges.length - 1].end = cur - separator.length - 5;
                    }
                }
            } else {
                break;
            }

            cur++;
        }
    } else {
        cur++;
    }
}
// — — — — — — — — — — — — — — —
                    for (var i = 0; i < ranges.length; i++){
                        var headers = '',
                            headers_array = new Uint8Array(
                                response,
                                ranges[i].headers,
                                ranges[i].begin - 4 - ranges[i].headers
                            );

                        for (var j = 0; j < headers_array.length; j++){
                            headers += String.fromCharCode(headers_array[j]);
                        }

                        out.push({
                            'headers': headers,
                            'getHeader': function(header){
                                var
                                    regexp = new RegExp(header + ': (.+)'),
                                    matches = this.headers.match(regexp);

                                return matches[1];
                            },
                            'content': response.slice(ranges[i].begin, ranges[i].end)
                        })
                    }

                    return out;
                })(this.response, separator);

                callback(parts);
            } else {
                callback(false);
            }
        }
    }

    xhr.responseType = 'arraybuffer';
    xhr.send(null);
}

var test_limit = 0;

function get_mp3_first_frame_info(url, offset, callback){

    if (test_limit > 0){
        test_limit--;
    } else {
        callback({});
        return false;
    }

    var ranges = [
        [offset, offset + 4],
        [offset + 8, offset + 12]
    ];

    get_binary_data_from_url(url, ranges, function(response){
        // new Uint8Array();
        //console.log('callback:', response[0]);
        // Версия MPEG

        // Layer
        callback({});
    });
};


function get_mp3_info(url, callback){
    if (typeof callback != 'function'){
        console.warn('KZVK: get_mp3_info: callback не функция');
        return false;
    }

    var
        range = [0, 9],
        data = {
            'available': false,
            'mp3': {}
        };

    get_binary_data_from_url(url, range, function(response){
        if (response && response[0].headers){
            response = response[0];

            if (response.getHeader('Content-Type') != 'audio/mpeg'){
                console.log('KZVK: get_mp3_info:', 'не «audio/mpeg»');
                callback(data);
                return false;
            }

            data.available = true;
            var buffer = response.content;

            // Размер файла
            data.mp3.size = (function(range){
                var out = range.match(/\d+?$/);
                if (out && out[0])
                    return out[0];
                else
                    return false;
            })(response.getHeader('Content-Range'));

            if (!data.mp3.size){
                callback(data);
                return false;
            }

            // Версия тега
            data.mp3.tag_version = (function(buffer){
                var identifier = new Uint8Array(buffer, 0, 3);
                identifier = String.fromCharCode(identifier[0], identifier[1], identifier[2]);

                if (identifier == 'ID3'){
                    var version = new Uint8Array(buffer, 3, 1);
                    return 'ID3v2.' + version[0];
                } else {
                    //console.log('KZVK: get_mp3_info:', 'not ID3v2');
                    return false;
                }
            })(buffer);

            if (!data.mp3.tag_version){
                callback(data);
                return false;
            }

            // Длина тега
            data.mp3.tag_length = (function(buffer){
                var length = new Uint8Array(buffer, 6, 4);

                return length[3] & 0x7f
                    | ((length[2] & 0x7f) << 7)
                    | ((length[1] & 0x7f) << 14)
                    | ((length[0] & 0x7f) << 21);
            })(buffer);

            // Первый фрейм
            get_mp3_first_frame_info(url, data.mp3.tag_length + 10, function(frame_info){
                // ??
                callback(data);
            });

        } else {
            callback(data);
        }
    });
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

function createButton(element, info){
    if (element.classList.contains('kz-vk-audio__finished')) return false;

    // Если кнопка уже есть
    var
        DOM_kz__wrapper = element.querySelector('.kz-vk-audio__wrapper'),
        makenew = false;

    if (!DOM_kz__wrapper){
        makenew = true

        // Опредлеение типа элемента
        if (element.parentElement.getAttribute('id') === 'initial_list')
            var type = 'default';
        else if (element.parentElement.getAttribute('id') === 'search_list')
            var type = 'default';
        else if (element.parentElement.classList.contains('audio_results'))
            var type = 'search_audio';
        else if (element.parentElement.parentElement.classList.contains('show_media'))
            var type = 'search';
        else if (element.parentElement.getAttribute('id') === 'pad_playlist')
            var type = 'pad';
        else if (element.parentElement.classList.contains('wall_audio'))
            var type = 'wall';

        if (!type) return false;

        if ((type === 'default') || (type === 'pad')){
            var DOM_play = element.querySelector('.area .play_btn')
        }

        if ((type === 'wall') || (type === 'search_audio') || (type === 'search')){
            var DOM_play = element.querySelector('.area .play_btn_wrap');
        }

        // Создание кнопки
        DOM_kz__wrapper = document.createElement('div');
        DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

        DOM_kz__wrapper.innerHTML =
            '<div class="kz-vk-audio__carousel">' +
                '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
                '<div class="kz-vk-audio__carousel__item kz-progress">' +
                    '<div class="kz-vk-audio__progress-filling"></div>' +
                '</div>' +
                '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
            '</div>';
    } else {
        console.log('УЖЕ БЫЛА')
    }

    var
        DOM_kz__carousel = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__unavailable = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');

    if (info.available){
        if (!('mp3' in info)) info.mp3 = {};
        if (!('bitrate' in info.mp3)){
            if ('size' in info.mp3){
                if ('tag_version' in info.mp3 && (
                    info.mp3.tag_version == 'ID3v2.2' ||
                    info.mp3.tag_version == 'ID3v2.3' ||
                    info.mp3.tag_version == 'ID3v2.4'
                )){
                    info.mp3.bitrate =
                        calc_bitrate_classic(info.mp3.size - info.mp3.tag_length - 10,
                            info.vk.duration);
                } else
                    info.mp3.bitrate = calc_bitrate_classic(info.mp3.size, info.vk.duration);
            } else
                info.mp3.bitrate = false;
        }

        DOM_kz__carousel.classList.add('kz-bitrate');
        //NOTE: Нужен TOGGLE для классов, отвечающих за состояния элемента
        //element.classList.add('kz-bitrate');

        DOM_kz__bitrate.addEventListener('click', function(event){
            stopEvent(event);
            save(info.vk.url, info.vk.artist + ' — ' + info.vk.title + '.mp3', DOM_kz__wrapper);
        }, false)

        DOM_kz__bitrate.setAttribute('data-bitrate', info.mp3.bitrate || '??');

        if (info.mp3.bitrate >= 288)
            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--320');
        else if (info.mp3.bitrate >= 224)
            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--256');
        else if (info.mp3.bitrate >= 176)
            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--196');
        else if (info.mp3.bitrate >= 112)
            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--128');
        else
            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--crap');
    } else {
        element.classList.add('kz-vk-audio__unavailable');
        DOM_kz__unavailable.addEventListener('click', stopEvent, false);
    }

    if (makenew){
        if (DOM_play.nextSibling)
            DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
        else
            DOM_play.parentElement.appendChild(DOM_kz__wrapper);
    }

    element.classList.add('kz-vk-audio__finished');

}


function process(element, options){
    if (element.classList.contains('kz-vk-audio__finished')) return false;

    // Информация об аудиозаписи со страницы
    var info = (function(element){
        var info = {
            'available': true,
            'vk' : {}
        }

        info.vk.id = element.querySelector('a:first-child').getAttribute('name');

        var deleted = element.querySelector('.area.deleted');

        if (deleted){
            info.available = false;
            return false;
        }

        var audio_info = element.querySelector('#audio_info' + info.vk.id).value.split(',');

        info.vk.url = audio_info[0];
        info.vk.duration = audio_info[1];

        if (!info.vk.url || info.vk.url == '')
            info.available = false;

        var DOM_tw = element.querySelector('.area .info .title_wrap');
        info.vk.artist = DOM_tw.querySelector('b > a').textContent.replace(/^s+|\s+$/g, '');
        info.vk.title = DOM_tw.querySelector('.title').textContent.replace(/^s+|\s+$/g, '');

        return info;
    })(element);

    if (info.available === true){
        if (options.audio__cache === true){
// — — — — — — — — — — — — — — — — — — — — — — — —
// NOTE: Нужен рефакторинг
(function(info){
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
            .get(info.vk.id);

        request.onsuccess = function(event){
            if (event.target.result){
                if(!('mp3' in info)) info.mp3 = {};
                info.mp3.bitrate = event.target.result.bitrate;
                createButton(element, info);
            } else {
                get_mp3_info(info.vk.url, function(response){
                    if (response.available === true)
                        info.available = true;
                    if ('mp3' in response)
                        info.mp3 = response.mp3;

                    createButton(element, info);

                    connect(function(db){
                        var request = db.transaction([storeName], 'readwrite')
                            .objectStore(storeName)
                            .add({
                                'id': info.vk.id,
                                'bitrate': response.mp3.bitrate
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

            get_mp3_info(info.vk.url, function(response){
                if (response.available === true)
                    info.available = true;
                if ('mp3' in response)
                    info.mp3 = response.mp3;

                createButton(element, info);
            });
        }
    });

})(info);
// — — — — — — — — — — — — — — — — — — — — — — — —
        } else {
            get_mp3_info(info.vk.url, function(response){
                if (response.available === true)
                    info.available = true;
                if ('mp3' in response)
                    info.mp3 = response.mp3;

                createButton(element, info);
            });
        }
    } else {
        //console.log('Не доступен', info);
        createButton(element, info);
    }

}


function init(options){
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

    each(document.querySelectorAll('.audio'), function(item){
        process(item, options);
    });

    // при вставке новых элементов
    document.addEventListener('DOMNodeInserted', function(event){
        if ('classList' in event.target){
            if (event.target.classList.contains('audio')){
                process(event.target, options);
                return true;
            }

            if (event.target.classList.contains('area')){
                if (event.target.parentElement.classList.contains('audio')){
                    event.target.parentElement.classList.remove('kz-vk-audio__finished');
                    process(event.target.parentElement, options);
                    return true;
                }
            }

            if ('classList' in event.target){
                each(event.target.querySelectorAll('.audio'), function(item){
                    process(item, options);
                });
                return true;
            }
        }
    });
};


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
