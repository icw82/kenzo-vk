(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'audio',
    version: '1.0.0',
    list: [] // временно здесь
};

// Должен работать как filter
function sift(array, callback){
    //var filtered = array.filter(callback);
    //array.splice(0);

//    each (filtered, function(item){
//        //array.push(item);
//    });

}

// Отлов изменений списка аудиозаписей
mod.list_observer = function(changes){
    console.info('list_observer');
    var added = 0;

    each (changes, function(ch){
        if (ch.type == 'add'){
            added++
            //console.log('**', ch.object[ch.name]);
        } else if (ch.type == 'update'){
            if (ch.name != 'length')
                console.log('** update:', ch);
        } else {
            deleted++
            //console.log('**** delete:', ch);
        }
    });

    if (added)
        console.log('added:', added);

    if (deleted)
        console.log('deleted:', deleted);

    console.log('*************** 1 ************');
    sift (mod.list, function(item){
        return document.body.contains(item.dom);
    });
    console.log('*************** 2 ************');

    each (mod.list, function(item, i){
        if (i < 5)
            console.log(item.dom);
    });

    //console.log('list', mod.list);

//    oldValue: только для типов "update" и "delete".
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
                console.log('----area', element.parentElement);
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
    var _ = {};

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
