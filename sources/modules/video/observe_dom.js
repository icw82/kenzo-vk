// Отлов вставки элементов DOM
mod.new_nodes_listner = function(element) {
    if (element instanceof Element) {

        var id = element.getAttribute('id');

        if (id && (id == 'video_player') || (id == 'html5_player')) {
            mod.registry.add(element);
        }
    }
}

mod.observe_dom = function() {
    // Если страница с видео открыта сразу
    each (document.querySelectorAll('#video_player, #html5_player'), function(element) {
        mod.registry.add(element);
    });

    var new_nodes_observer = new MutationObserver(function(mutations) {
        each (mutations, function(mr) {
            each (mr.addedNodes, mod.new_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList:true, subtree:true});
}
