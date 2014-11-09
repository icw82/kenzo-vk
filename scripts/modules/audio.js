(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'audio',
    version: '1.0.0',
    list: [], // временно здесь
    audio_item_classes: [
        'kz-bitrate',
        'kz-progress',
        'kz-unavailable'
    ]
};

function i8ArrayTo2(array){
    var _ = '';
    each (array, function(item){
        _ += i8to2(item);
    });
    return _;
}

function i8to2(int8){
    var _ = int8.toString(2);
    while (_.length < 8){
        _ = '0' + _;
    }
    return _;
}

function i8ArrayToString(array){
    var _ = '';
    each (array, function(item){
        _ += String.fromCharCode(item);
    });
    return _;
}

mod.create_button = function(item){
    if (typeof item !== 'object'){
        console.warn('create_button: не передан объект');
        return false;
    }
    if (!(item.dom instanceof Element)){
        console.warn('create_button: не найден DOM-элемент');
        return false;
    }

    var element = item.dom;

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

    if (!type){
        console.warn('Тип элемента не определён')
        return false;
    }

    if (
        (type === 'default') ||
        (type === 'pad')
    ){
        var DOM_play = element.querySelector('.area .play_btn');
    } else if (
        (type === 'wall') ||
        (type === 'search_audio') ||
        (type === 'search') ||
        (type === 'messages') ||
        (type === 'attach')
    ){
        var DOM_play = element.querySelector('.area .play_btn_wrap');
    }

    // Создание кнопки
    var DOM_kz__wrapper = document.createElement('div');
    DOM_kz__wrapper.classList.add('kz-vk-audio__wrapper');

    var carousel_classes = 'kz-vk-audio__carousel';
    if (kzvk.options.audio__simplified)
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

    if (DOM_play.nextSibling){
        DOM_play.parentElement.insertBefore(DOM_kz__wrapper, DOM_play.nextSibling);
    } else {
        DOM_play.parentElement.appendChild(DOM_kz__wrapper);
    }

    item.wrapper = DOM_kz__wrapper;
}

// VIEW
mod.update_view = function(item){

//    if (!(item.wrapper instanceof Element)){
//        mod.create_button(item);
//    }

    var DOM_kz__carousel = item.wrapper
            .querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate = item.wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__unavailable = item.wrapper
            .querySelector('.kz-vk-audio__carousel__item.kz-unavailable');


    DOM_kz__unavailable.addEventListener('click', kenzo.stop_event, false);

    if (item.available === false)
        console.log('>>', item);
    //console.log(item.available);

    if (item.available){
//        if (!('mp3' in info)) info.mp3 = {};
//
//        if (
//            ('vbr' in info.mp3) &&
//            (typeof info.mp3.vbr !== 'undefined') &&
//            (info.mp3.vbr !== false)
//        ){
//            var message = 'VBR';
//        } else {
//            if (
//                !('bitrate' in info.mp3) ||
//                (typeof info.mp3.bitrate === 'undefined') ||
//                (info.mp3.bitrate === false)
//            ){
//                if ('size' in info.mp3){
//                    if ('tag_version' in info.mp3 && (
//                        info.mp3.tag_version == 'ID3v2.2' ||
//                        info.mp3.tag_version == 'ID3v2.3' ||
//                        info.mp3.tag_version == 'ID3v2.4'
//                    )){
//                        info.mp3.bitrate =
//                            calc_bitrate_classic(info.mp3.size - info.mp3.tag_length - 10,
//                                info.vk.duration);
//                    } else
//                        info.mp3.bitrate = calc_bitrate_classic(info.mp3.size, info.vk.duration);
//                } else {
//                    info.mp3.bitrate = false;
//                }
//            }
//
//            var message = info.mp3.bitrate || '??';
//        }
//
//        kenzo.toggle_class(item.dom, 'kz-bitrate', mod.audio_item_classes);
//
//        DOM_kz__bitrate.addEventListener('click', function(event){
//            kenzo.stop_event(event);
//
//            chrome.runtime.sendMessage({
//                action: 'save-vk-audio',
//                url: info.vk.url,
//                name: info.vk.artist + ' ' + options.audio__separator + ' '
//                    + info.vk.title + '.mp3',
//                vk: info.vk
//            });
//
//            console.log('Отправлено в загрузки');
//
//        }, false);
//
//        DOM_kz__bitrate.setAttribute('data-message', message);
//
//        if (info.mp3.bitrate >= 288)
//            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--320');
//        else if (info.mp3.bitrate >= 224)
//            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--256');
//        else if (info.mp3.bitrate >= 176)
//            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--196');
//        else if (info.mp3.bitrate >= 112)
//            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--128');
//        else
//            DOM_kz__carousel.classList.add('kz-vk-audio__bitrate--crap');
    } else {
        kenzo.toggle_class(item.dom, 'kz-unavailable', mod.audio_item_classes, false);
    }

};


// MODEL AND CONTROLLERs

mod.calc_bitrate_classic = function(size, duration){
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

mod.get_more_mp3_info = function(url, info, callback){

    var offset = info.mp3.tag_length,
        ranges = [
            [offset, offset + 40] //170
        ];

    kzvk.get_buffer(url, ranges, function(response){

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
            //console.warn(info.mp3.error);
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

mod.get_mp3_info = function(url, callback, vbr){
    if (typeof callback != 'function'){
        console.warn('kzvk: callback не функция');
        return false;
    }

    var range = [0, 9],
        data = {
            'available': false,
            'mp3': {}
        };

    kzvk.get_buffer(url, range, function(response){
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
                    return parseInt(out[0]);
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
                mod.get_more_mp3_info(url, data, function(response){
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

//
mod.get_advanced_info = function(info){
    if (info.available === true){
        if (kzvk.options.audio__cache === true){
//            // получить информацию из кэша
//            // и если её там нет, то напрямую
            mod.get_mp3_info(info.url, function(response){
                //console.log('get_mp3_info callback', response);

                if (response.available === true)
                    info.available = true;
                if ('mp3' in response){
                    for (var key in response.mp3){
                        info[key] = response.mp3[key];
                    }
                }

            }, kzvk.options.audio__vbr);
        } else {
            mod.get_mp3_info(info.url, function(response){
//                console.log('get_mp3_info callback', response);

                if (response.available === true)
                    info.available = true;
                if ('mp3' in response)
                    info.mp3 = response.mp3;

            }, kzvk.options.audio__vbr);
        }
    } else {
        //console.log(info);
    }
}

// Отлов изменений объекта аудизаписи в списке
mod.item_observer = function(changes){
    try { // для отлова ошибок внутри Object.observe();
        var goals = []; // Изменённые объекты

        each (changes, function(ch){
            if (
                (ch.name === 'wrapper') ||
                (ch.name === 'size') ||
                (ch.name === 'tag_version')
            ){
                if (goals.indexOf(ch.object) === -1)
                    goals.push(ch.object);
            }
        });

        if (goals.length > 0){

            each (goals, function(item){
                mod.update_view(item);
            });
        } else {
            console.log('false shit');
        }
    } catch (error) {
        console.error(error);
    }
}

mod.list_clean = function(){
    // Очистка списка
    mod.list = mod.list.filter(function(item){
        return document.body.contains(item.dom);
    });

    // Перезапуск наблюдателя (т. к. предыдущий объект уничтожен)
    Object.observe(mod.list, mod.list_observer);
}

// Отлов изменений списка аудиозаписей
mod.list_observer = function(changes){
    try { // для отлова ошибок внутри Object.observe();

        var added = 0,
            deleted = 0;

        each (changes, function(ch){
            if (ch.type == 'add'){
                Object.observe(ch.object[ch.name], mod.item_observer);
                mod.create_button(ch.object[ch.name]);

                // Расширенная информация о файле
                mod.get_advanced_info(ch.object[ch.name]);

                // обновление вида

                //console.log('**', ch.object[ch.name]);

                added++;
            } else if (ch.type == 'update'){
                if (ch.name != 'length')
                    console.log('** update:', ch);
            } else {
                //deleted++
                //console.log('**** delete:', ch);
            }
        });

        if (added){
    //        console.log('added:', added);
    //        console.log('total:', mod.list.length);
            mod.list_clean();
        }

    //    if (deleted){
    //        console.log('deleted:', deleted);
    //        console.log('total:', mod.list.length);
    //    }

    //    oldValue: только для типов "update" и "delete".

    } catch (error) {
        console.error(error);
    }
}

Object.observe(mod.list, mod.list_observer);

// Отлов вставки элементов DOM
mod.document_listner = function(element){
    if (element instanceof Element){
        if (element.classList.contains('audio')){
            mod.add_audio_element(element);
            return true;
        }

        if (element.classList.contains('area')){
            if (element.parentElement.classList.contains('audio')){
                //console.log('----area', element.parentElement);
                mod.add_audio_element(element.parentElement);
                return true;
            }
        }

        var audios = element.querySelectorAll('.audio');

        if (audios.length > 0){
            each (audios, function(item){
                mod.add_audio_element(item);
            });
            return true;
        }


//        // инициируется один раз
//        if (!mod.dom.global_player){
//            if (element.getAttribute('id') === 'gp'){
//                mod.dom.global_player = element;
//                mod.global_player_event_listener();
//                return true;
//            }
//        }
    }
}

// Отлов изменений плеера (?)
//mod.global_player_event_listener = function(){
//    mod.dom.global_player.addEventListener('DOMNodeInserted', function(event){
//        if (
//            (event.target instanceof Element) &&
//            (event.target.localName == 'a') &&
//            (event.target.querySelector('#gp_play'))
//        ){
//            var onclick_instructions = event.target.getAttribute('onclick'),
//                matches = onclick_instructions.match(/playAudioNew\('(.+?)'/);
//
//            if (matches[1] && (matches[1] != kzvk.globals.now_playing)){
//                chrome.storage.local.set({'audio':{'now_playing': matches[1]}});
//            }
//
//        }
//    });
//}


// Собирает информацию из DOM-элемента аудиозаписи
// Возвращает объект:
//    id — vk идентификатор;
//    vk_artist — vk исполнитель;
//    vk_title — vk название;
//    available — доступна ли аудиозапись;
//    url — url записи;
//    vk_duration — продолжительность записи.
mod.get_audio_element_info = function(element){
    var _ = {
        available: true
    };

    _.id = element.querySelector('a:first-child').getAttribute('name');

    var DOM_tw = element.querySelector('.area .info .title_wrap');
    _.vk_artist = DOM_tw.querySelector('b').textContent.trim();
    _.vk_title = DOM_tw.querySelector('.title').textContent.trim();

    if (element.querySelector('.area.deleted')){
        _.available = false;
        return _;
    }

    var audio_info = element.querySelector('#audio_info' + _.id).value.split(',');
    _.url = audio_info[0];
    _.vk_duration = audio_info[1];

    if (!_.url || _.url == '')
        _.available = false;

    return _;
}

// Добавляет элемент в список обновляет уже имеющийся элемент.
mod.add_audio_element = function(element){
    // Плеер не нужен
    if (element.getAttribute('id') === 'audio_global')
        return false;

    var info = mod.get_audio_element_info(element);
    info.dom = element;

    mod.list.push(info);
}

mod.init = function(){
    mod.dom = {
        body: document.querySelector('body'),
        global_player: document.querySelector('#gp')
    }

    kzvk.class_forever('kz-vk-audio', mod.dom.body);

    // Обработка уже имеющихся аудиозаписей на странице
    each (document.querySelectorAll('.audio'), function(element){
        mod.add_audio_element(element);
    });

    var DOM_observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            //if (mr.target.classList.contains('audio') && mr.attributeName == 'class')
                //console.log('*===========', mr.target.getAttribute('class'));

            if (mr.addedNodes.length > 0){
                //console.log('**', mr.addedNodes);
                each (mr.addedNodes, mod.document_listner);

//                each (mr.removedNodes, function(node){
//                    console.log('removed **', node);
//                });
            }
        });
    });

    DOM_observer.observe(mod.dom.body, {childList:true, attributes:true, subtree:true});

//
//    if (mod.dom.global_player)
//        mod.global_player_event_listener();
//
//    // Индикатор загрузки играющего трека
//    kzvk.globals.vk_load = null;
//
//    #pd_load_line
//    ac_load_line
//    audio_progress_line


}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
