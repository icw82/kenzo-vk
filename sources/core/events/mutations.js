{
    core.events.on_mutation = new kk.Event();
    let DOM_observer = new MutationObserver(function(mutations) {
        core.events.on_mutation.dispatch(mutations);
    });
    DOM_observer.observe(document, {childList: true, subtree: true});

    core.events.on_node_addition = new kk.Event();
    core.events.on_node_removal = new kk.Event();
    core.events.on_mutation.addListener(mutations => {
        each (mutations, function(mutation) {
            each (mutation.addedNodes, element => {
                core.events.on_node_addition.dispatch(element);
            });
            each (mutation.removedNodes, element => {
                core.events.on_node_removal.dispatch(element);
            });
        });
    });

    core.events.on_element_addition = new kk.Event();
    core.events.on_node_addition.addListener(element => {
        if (kk.is.E(element))
            core.events.on_element_addition.dispatch(element);
    });

    core.events.on_element_removal = new kk.Event();
    core.events.on_node_removal.addListener(element => {
        if (kk.is.E(element))
            core.events.on_element_removal.dispatch(element);
    });
}
