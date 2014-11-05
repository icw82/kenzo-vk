(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

var audio_item_classes = [
        'kz-bitrate',
        'kz-progress',
        'kz-unavailable'
    ],
    options = null,
    globals = {},
    list = [];


//function save(url, name, element){
//    (name) || (name = 'kenzo-vk-audio.mp3');
//
//    var
//        xhr = new XMLHttpRequest(),
//        progress = 0,
//        abort = false,
//
//        // TODO: clean
//        DOM_kz__carousel =
//            element.querySelector('.kz-vk-audio__carousel'),
//        DOM_kz__bitrate =
//            element.querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
//        DOM_kz__progress =
//            element.querySelector('.kz-vk-audio__carousel__item.kz-progress'),
//        DOM_kz__progress_filling =
//            element.querySelector('.kz-vk-audio__progress-filling');
//
//    DOM_kz__progress.addEventListener('click', function(event){
//        kenzo.stop_event(event);
//        xhr.abort();
//        abort = true;
//        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
//        toggle_class(element, 'kz-bitrate', audio_item_classes);
//    }, false);
//
//    xhr.responseType = 'blob';
//    xhr.onreadystatechange = function(){
//        if (xhr.readyState === 1)
//            toggle_class(element, 'kz-progress', audio_item_classes);
///*
//        if ((xhr.readyState === 4) && (xhr.status === 200)){
//
//        }
//*/
//    }
//
//    xhr.onprogress = function(progress){
//        if (progress.lengthComputable && !abort){
//            toggle_class(element, 'kz-progress', audio_item_classes);
//            progress = Math.floor(progress.loaded / progress.total * 100);
//            DOM_kz__progress_filling.style.left = -100 + progress + '%';
//            //DOM_kz__carousel.localName.removeClass('kz-simplified-view');
//            //DOM_kz__progress.setAttribute('data-progress', progress + '%');
//        }
//    }
//    xhr.onload = function(){
//        var blob = new window.Blob([this.response], {'type': 'audio/mpeg'});
//        saveAs(blob, name);
//        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
//        toggle_class(element, 'kz-bitrate', audio_item_classes);
//    }
//    xhr.open('GET', url, true);
//    xhr.send(null);
//};


function i8ArrayTo2(array){
    var out = '';
    each (array, function(item){
        out += i8to2(item);
    });
    return out;
}

function i8to2(int8){
    var out = int8.toString(2);
    while (out.length < 8){
        out = '0' + out;
    }
    return out;
}

function i8ArrayToString(array){
    var out = '';
    each (array, function(item){
        out += String.fromCharCode(item);
    });
    return out;
}

function get_more_mp3_info(url, info, callback){

    var offset = info.mp3.tag_length,
        ranges = [
            [offset, offset + 40] //170
        ];

    kzGetBuffer(url, ranges, function(response){

        // VBR по умолчанию false;
        info.mp3.vbr = false;

        // Чтение заголовка mp3 фрейма
        (function(){
            var view = new Uint8Array(response[0].content, 0, 4),
                view_binary = i8ArrayTo2(view);

            // AAAAAAAAAAA BB CC D EEEE FF G H II JJ K L MM
            // 11111111111 11 01 1 1001 00 0 0 01 10 0 1 00

            // A
            if (view_binary.slice(0, 11) !== '11111111111'){
                info.mp3.error = 'Фрейм не обнаружен';
                return false;
            }

            // B
            if (view_binary.slice(11, 13) !== '11'){
                info.mp3.error = 'Версия не MPEG 1';
                return false;
            }

            // E
            info.mp3.bitrate = {
                '01': [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0],
                '10': [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
                '11': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0]
            }[view_binary.slice(13, 15)][parseInt(view_binary.slice(16, 20), 2)];

            // F
            info.mp3.samplerate = {
                '00': 44100,
                '01': 48000,
                '10': 32000
            }[view_binary.slice(20, 22)];

            // I
            info.mp3.channelmode = parseInt(view_binary.slice(24, 26), 2);
// ['Stereo', 'Joint stereo (Stereo)', 'Dual channel (Stereo)', 'Single channel (Mono)'];

        })();

        if ('error' in info.mp3){
            console.warn(info.mp3.error);
            callback(info);
            return false;
        }

        // Проверка на наличие VBR заголовков
        (function(){
            var view = new Uint8Array(response[0].content, 36, 4),
                header = i8ArrayToString(view);


            if (header === 'VBRI' || header === 'Xing'){
                info.mp3.vbr = header;
            } else if (info.mp3.channelmode === 3){
                view = new Uint8Array(response[0].content, 21, 4);
                header = i8ArrayToString(view);
                if (header === 'Xing')
                    info.mp3.vbr = header;
            }

            callback(info);
/*
            var view = new Uint8Array(response[0].content, 155, 15);

            console.log(header, view , i8ArrayToString(view));

*/
        })();
    });
};


function get_mp3_info(url, callback, vbr){

    if (typeof callback != 'function'){
        console.warn('KZVK: callback не функция');
        return false;
    }

    var range = [0, 9],
        data = {
            'available': false,
            'mp3': {}
        };

    kzGetBuffer(url, range, function(response){
        if (response && response[0].headers){
            response = response[0];

            if (response.getHeader('Content-Type') != 'audio/mpeg'){
                console.log('KZVK: не «audio/mpeg»');
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
                    //console.log('KZVK: not ID3v2');
                    return false;
                }
            })(buffer);

            if (!data.mp3.tag_version){
                callback(data);
                return false;
            }

            // Длина тега
            data.mp3.tag_length = 10 + (function(buffer){
                var length = new Uint8Array(buffer, 6, 4);

                return length[3] & 0x7f
                    | ((length[2] & 0x7f) << 7)
                    | ((length[1] & 0x7f) << 14)
                    | ((length[0] & 0x7f) << 21);
            })(buffer);

            // VBR
            if (vbr){
                get_more_mp3_info(url, data, function(response){
                    callback(response);
                });
            } else {
                callback(data);
            }
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
    // Если кнопка уже есть
    var DOM_kz__wrapper = element.querySelector('.kz-vk-audio__wrapper'),
        makenew = false;

    if (!DOM_kz__wrapper){
        makenew = true

        if (!element.parentElement){
            console.warn('?:', element);
            return false;
        }

        // Опредлеение типа элемента
        if (element.parentElement.getAttribute('id') === 'initial_list')
            var type = 'default';
        else if (element.parentElement.getAttribute('id') === 'search_list')
            var type = 'default';
        else if (element.parentElement.classList.contains('audio_results'))
            var type = 'search_audio';
        else if (
            (element.parentElement.parentElement instanceof Element) &&
            element.parentElement.parentElement.classList.contains('show_media')
        )
            var type = 'search';
        else if (element.parentElement.getAttribute('id') === 'pad_playlist')
            var type = 'pad';
        else if (
            element.parentElement.classList.contains('wall_text') ||
            element.parentElement.classList.contains('wall_audio')
        )
            var type = 'wall';
        else if (element.parentElement.classList.contains('post_audio'))
            var type = 'messages';
        else if (element.parentElement.classList.contains('audio_content')){
            if(element.parentElement.parentElement.classList.contains('choose_audio_row'))
                var type = 'attach';
        }

        if (!type) return false;

        if (
            (type === 'default') ||
            (type === 'pad')
        ){
            var DOM_play = element.querySelector('.area .play_btn');
        }

        if (
            (type === 'wall') ||
            (type === 'search_audio') ||
            (type === 'search') ||
            (type === 'messages') ||
            (type === 'attach')
        ){
            var DOM_play = element.querySelector('.area .play_btn_wrap');
        }

        // Создание кнопки
        DOM_kz__wrapper = document.createElement('div');
        DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

        var carousel_classes = 'kz-vk-audio__carousel';
        if (options.audio__simplified)
            carousel_classes += ' kz-simplified-view';

        DOM_kz__wrapper.innerHTML =
            '<div class="' + carousel_classes + '">' +
                '<div class="kz-vk-audio__carousel__item kz-bitrate"></div>' +
                '<div class="kz-vk-audio__carousel__item kz-progress">' +
                    '<div class="kz-vk-audio__progress-filling"></div>' +
                '</div>' +
                '<div class="kz-vk-audio__carousel__item kz-unavailable"></div>' +
                '<div class="kz-vk-audio__carousel__item kz-direct"></div>' +
            '</div>';
    }

    var DOM_kz__carousel = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__unavailable = DOM_kz__wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');

    DOM_kz__unavailable.addEventListener('click', kenzo.stop_event, false);

    if (info.available){
        if (!('mp3' in info)) info.mp3 = {};

        if (
            ('vbr' in info.mp3) &&
            (typeof info.mp3.vbr !== 'undefined') &&
            (info.mp3.vbr !== false)
        ){
            var message = 'VBR';
        } else {
            if (
                !('bitrate' in info.mp3) ||
                (typeof info.mp3.bitrate === 'undefined') ||
                (info.mp3.bitrate === false)
            ){
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
                } else {
                    info.mp3.bitrate = false;
                }
            }

            var message = info.mp3.bitrate || '??';
        }

        toggle_class(element, 'kz-bitrate', audio_item_classes);

        DOM_kz__bitrate.addEventListener('click', function(event){
            kenzo.stop_event(event);

            chrome.runtime.sendMessage({
                action: 'save-vk-audio',
                url: info.vk.url,
                name: info.vk.artist + ' ' + options.audio__separator + ' '
                    + info.vk.title + '.mp3',
                vk: info.vk
            });

            console.log('Отправлено в загрузки');

        }, false);

        DOM_kz__bitrate.setAttribute('data-message', message);

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
        toggle_class(element, 'kz-unavailable', audio_item_classes, false);
    }

    if (makenew){
        if (DOM_play.nextSibling)
            DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
        else
            DOM_play.parentElement.appendChild(DOM_kz__wrapper);
    }
}

function process_2(element, info, options){
    var db = null,
        dbName = 'audio',
        dbVersion = 3,
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
            .get(info.id);

        request.onsuccess = function(event){
            if (event.target.result){
                if (!('mp3' in info)) info.mp3 = {};

                info.mp3.bitrate = event.target.result.bitrate;
                info.mp3.size = event.target.result.size;

                if (options.audio__vbr === false){
                    info.mp3.bitrate = false;
                    createButton(element, info);
                    return false;
                }

                if (typeof event.target.result.vbr !== 'undefined'){
                    info.mp3.vbr = event.target.result.vbr;
                    createButton(element, info);
                    return false;
                }
            }

            get_mp3_info(info.vk.url, function(response){
                info.available = response.available;

                if (info.available !== true){
                    createButton(element, info);
                    return false;
                }

                if ('mp3' in response)
                    info.mp3 = response.mp3;

                createButton(element, info);

                // TODO: проверка на наличие битрейта

                connect(function(db){
                    var data = {
                        'id': info.id,
                        'size': info.mp3.size,
                        'vbr': info.mp3.vbr,
                        'bitrate': info.mp3.bitrate
                    }

                    var request = db.transaction([storeName], 'readwrite')
                        .objectStore(storeName)
                        .put(data);

                    request.onsuccess = function(event){
                        db.close();
                    }

                    request.onerror = function(){
                        console.warn('KZVK: cache-update:', event);
                        db.close();
                    }
                });

            }, options.audio__vbr);

        }

        request.onerror = function(){
            console.log('KZVK:', 'connect.onerror:', event);
            process__simple(element, info, options);
        }
    });

}

function process__simple(element, info, options){
    get_mp3_info(info.vk.url, function(response){
        if (response.available === true)
            info.available = true;
        if ('mp3' in response)
            info.mp3 = response.mp3;

        createButton(element, info);
    }, options.audio__vbr);
}

function get_vk_info(element){
    var info = {
        'dom': element,
        'available': true,
        'vk' : {}
    }

    info.id = element.querySelector('a:first-child').getAttribute('name');

    if (element.querySelector('.area.deleted')){
        info.available = false;
        return info;
    }

    var audio_info = element.querySelector('#audio_info' + info.id).value.split(',');

    info.vk.url = audio_info[0];
    info.vk.duration = audio_info[1];

    if (!info.vk.url || info.vk.url == '')
        info.available = false;

    var DOM_tw = element.querySelector('.area .info .title_wrap');
    info.vk.artist = DOM_tw.querySelector('b > a').textContent.replace(/^s+|\s+$/g, '');
    info.vk.title = DOM_tw.querySelector('.title').textContent.replace(/^s+|\s+$/g, '');

    return info;
}

// Обработка элемента
function process(element){
    if (element.getAttribute('id') === 'audio_global') return false;

    element.classList.add('kz-vk-audio__item');

    // Информация об аудиозаписи со страницы
    var info = get_vk_info(element);

    each (list, function(item, i){
        if (item.id === info.id){
            list[i] = info;
            console.log(info.id, 'уже есть');
            return true;
        }
    }, function(){
        list.push(info);
        //console.log(info.id, '— новый');
    });

    //element.classList.contains('kz-data-obtained')

    // Получение инфомации о файле, если он доступен
    if (info.available === true){
        if (options.audio__cache === true)
            process_2(element, info, options);
        else
            process__simple(element, info, options);

    } else {
        createButton(element, info);
    }

}

/**/

})();