(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

// NOTE: Обязателен ли список?
mod.add_element_to_list = function(element, list) {
    if (!(element instanceof Element)) {
        mod.warn('add_element_to_list: DOM-элемент не передан');
        return false;
    }

    each (list, function(item) {
        if (item.dom_element === element) {
            //Отлов дублей
            return true;
        }
    }, function() {
        kzvk.modules.provider.get('videoview.getPlayerObject()').then(function(object) {
            if (typeof object !== 'object') {
                mod.log('Видеоплеер не обнаружен');
                return;
            }

            var info;

            if (object.type === 'application/x-shockwave-flash') {
                //var element = kzvk.dom.body.querySelector();
                info = mod.get_info_from_element(element);
            }

            else if (typeof object.vars === 'object')
                info = mod.get_info_from_object(object.vars, element);

            if (info) list.push(info);

        }, function(response) {
            mod.warn('add_element_to_list error', response);
        });
    });
}

// Отлов вставки элементов DOM
mod.new_nodes_listner = function(element) {
    if (element instanceof Element) {
        var id = element.getAttribute('id');

        if (id && (id == 'video_player') || (id == 'html5_player')) {
            mod.add_element_to_list(element, mod.list);
        }
    }
}

mod.observe_dom = function() {
    // Если страница с видео открыта сразу
    each (document.querySelectorAll('#video_player, #html5_player'), function(element) {
        // Будет единственным элементом.
        mod.add_element_to_list(element, mod.list);
    });

    var new_nodes_observer = new MutationObserver(function(mutations) {
        each (mutations, function(mr) {
            each (mr.addedNodes, mod.new_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList:true, subtree:true});
}

})(kzvk);
