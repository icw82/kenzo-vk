(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.add_element_to_list = function(element, list){
    if (!(element instanceof Element)){
        console.warn('add_element_to_list: DOM-элемент не передан');
        return false;
    }

    each (list, function(item){
        if (item.dom_element === element){
            //Отлов дублей
            return true;
        }
    }, function(){
        var info = mod.get_info_from_html(element);

        list.push(info);
    });
}

// Отлов вставки элементов DOM
mod.new_nodes_listner = function(element){
    if (element instanceof Element){
        if (element.getAttribute('id') == 'video_player'){
            mod.add_element_to_list(element, mod.list);
        }
    }
}

mod.observe_dom = function(){
    // Если страница с видео открыта сразу
    each (document.querySelectorAll('#video_player'), function(element){
        // Будет единственным элементом.
        mod.add_element_to_list(element, mod.list);
    });

    var new_nodes_observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            each (mr.addedNodes, mod.new_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList:true, subtree:true});
}

})(kzvk);
