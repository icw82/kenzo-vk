(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.observe_dom = function(){
    // Обработка уже имеющихся аудиозаписей на странице
    each (document.querySelectorAll('.audio'), function(element){
        mod.add_audio_element(element, mod.list);
    });

    // Если плеер уже есть
    each (document.querySelectorAll('#gp'), mod.observe_gp);

    var new_nodes_observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            each (mr.addedNodes, mod.new_nodes_listner);
            //each (mr.removedNodes, mod.remove_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList:true, subtree:true});
}

// Отлов вставки элементов DOM
mod.new_nodes_listner = function(element){
    if (element instanceof Element){
//        console.log('**element', element);

        // Появление глобального плеера
        if (element.getAttribute('id') === 'gp'){
            mod.observe_gp(element);
        }

        if (element.classList.contains('audio')){
            mod.add_audio_element(element, mod.list);
            return false;
        }

        if (element.classList.contains('area')){
            if (element.parentElement.classList.contains('audio')){
                //console.log('----area', element.parentElement);
                mod.add_audio_element(element.parentElement, mod.list);
                return false;
            }
        }

        var audios = element.querySelectorAll('.audio');

        if (audios.length > 0){
            each (audios, function(item){
                mod.add_audio_element(item, mod.list);
            });
            return false;
        }


//        console.log('**element', element);

//    // Индикатор загрузки играющего трека
//    kzvk.globals.vk_load = null;
//
//    #pd_load_line
//    ac_load_line
//    audio_progress_line

    }
}

// Добавляет элемент в список
mod.add_audio_element = function(element, list){
    if (!(element instanceof Element)){
        console.warn('add_audio_element: DOM-элемент не передан');
        return false;
    }

    each (list, function(item){
        if (item.dom_element === element){
            console.info('Отлов дублей, йоу')
            //return true;
        }
    }, function(){
        var info = mod.get_info_from_audio_element(element);

        if (!info.element_type)
            return false;

        list.push(info);
    });
}

// Собирает информацию из DOM-элемента аудиозаписи
// Возвращает объект:
//    id — vk идентификатор;
//    vk_artist — vk исполнитель;
//    vk_title — vk название;
//    available — доступна ли аудиозапись;
//    url — url записи;
//    vk_duration — продолжительность записи.
mod.get_info_from_audio_element = function(element){
    var _ = {
        available: true,
        dom_element: element,
        element_type: mod.get_audio_element_type(element),
        get vk_name() {
            if (
                (typeof this.vk_artist == 'string') &&
                (typeof this.vk_title == 'string')
            ){
                return this.vk_artist + ' '
                    + kzvk.options.audio__separator + ' '
                    + this.vk_title;
            }
        },
        get url_clean() {
            if (typeof this.url == 'string') {
                return this.url.replace('(^.+?)\?', '$');
            }
        }
    };

    if (!_.element_type){
        //console.warn('Тип элемента не определён', _);
        return _;
    }

    _.id = element.querySelector('a:first-child').getAttribute('name');

    var DOM_tw = element.querySelector('.area .info .title_wrap');
    _.vk_artist = DOM_tw.querySelector('b').textContent.trim();
    _.vk_title = DOM_tw.querySelector('.title').textContent.trim();

    if (element.querySelector('.area.deleted')){
        _.available = false;
        return _;
    }

    var audio_info = element.querySelector('#audio_info' + _.id);
    if (audio_info){
        audio_info = audio_info.value.split(',');
        _.url = audio_info[0];
        _.vk_duration = parseInt(audio_info[1]);
    }

    if (!_.url || _.url == '')
        _.available = false;

    _.id = _.id.replace(/(.?)_pad$/, '$1');

    return _;
}

mod.get_audio_element_type = function(element){
    var _ = false;

    if (!element.classList.contains('audio')){
        console.info('Не .audio');
        return _;
    }

    // Кнопка не предназначена для плеера
    if (element.getAttribute('id') === 'audio_global')
        return _;

    // Опредлеение типа элемента
    if (element.parentElement.getAttribute('id') === 'initial_list')
        _ = 'default';
    else if (element.parentElement.getAttribute('id') === 'search_list')
        _ = 'default';
    else if (element.parentElement.getAttribute('id') === 'pad_search_list')
        _ = 'default';
    else if (element.parentElement.classList.contains('audio_results'))
        _ = 'search_audio';
    else if (
        (element.parentElement.parentElement instanceof Element) &&
        element.parentElement.parentElement.classList.contains('show_media')
    )
        _ = 'search';
    else if (element.parentElement.getAttribute('id') === 'pad_playlist')
        _ = 'pad';
    else if (
        element.parentElement.classList.contains('wall_text') ||
        element.parentElement.classList.contains('wall_audio')
    )
        _ = 'wall';
    else if (element.parentElement.classList.contains('post_audio'))
        _ = 'messages';
    else if (element.parentElement.classList.contains('audio_content')){
        if (element.parentElement.parentElement.classList.contains('choose_audio_row'))
            _ = 'attach';
    }

    return _;
}

mod.remove_element_from_list = function(element, list){
//    if (!(element instanceof Element)){
//        console.warn('remove_element_from_list: DOM-элемент не передан');
//        return false;
//    }
}

mod.remove_nodes_listner = function(element){
    mod.remove_element_from_list(element, list);
}

})(kzvk);
