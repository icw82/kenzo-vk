(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.trash;

mod.observe_dom = function(){

    // Primary
    each (mod.observers, function(item){
        if (kzvk.options[item.option_name] === true)
            item.primary();
    });

    var new_nodes_observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            each (mr.addedNodes, mod.new_nodes_listner);
            //each (mr.removedNodes, mod.remove_nodes_listner);
        });
    });

    new_nodes_observer.observe(document, {childList:true, subtree:true});
}

mod.new_nodes_listner = function(element){
    if (!(element instanceof Element)) return false;

    //console.log('Trash observer:', element);

    // For observer
    each (mod.observers, function(item){
        if (kzvk.options[item.option_name] === true)
            item.for_observer(element);

    });
}

})(kzvk);
