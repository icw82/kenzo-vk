mod.observe_dom = function() {
    // Обработка уже имеющихся аудиозаписей на странице
    each (document.querySelectorAll('.audio'), function(element) {
        mod.registry.add(element);
    });

    // Если плеер уже есть
    each (document.querySelectorAll('#gp'), mod.observe_gp);

    var new_nodes_observer = new MutationObserver(function(mutations) {
        each (mutations, function(mr) {
            each (mr.addedNodes, mod.new_nodes_listner);
            //each (mr.removedNodes, mod.remove_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList: true, subtree: true});
}

// Отлов вставки элементов DOM
mod.new_nodes_listner = function(element) {
    if (element instanceof Element) {
//        mod.log('new element', element);

        // Появление глобального плеера
        if (element.getAttribute('id') === 'gp') {
            mod.observe_gp(element);
        }

        if (element.classList.contains('audio')) {
            mod.registry.add(element);
            return false;
        }

        if (element.classList.contains('area')) {
            if (element.parentElement.classList.contains('audio')) {
                //mod.log('area', element.parentElement);
                mod.registry.add(element.parentElement);
                return false;
            }
        }

        var audios = element.querySelectorAll('.audio');

        if (audios.length > 0) {
            each (audios, function(item) {

                mod.registry.add(item);
            });
            return false;
        }


//    // Индикатор загрузки играющего трека
//    ext.globals.vk_load = null;
//
//    #pd_load_line
//    ac_load_line
//    audio_progress_line

    }
};

mod.remove_element_from_list = function(element, list) {
//    if (!(element instanceof Element)) {
//        mod.warn('remove_element_from_list: DOM-элемент не передан');
//        return false;
//    }
}

mod.remove_nodes_listner = function(element) {
    mod.remove_element_from_list(element, list);
}
