{
    const key = kk.generate_key(10);

    core.events.on_mutation = new kk.Event(key);
    let DOM_observer = new MutationObserver(function(mutations) {
        core.events.on_mutation.dispatch(key, mutations);
    });
    DOM_observer.observe(document, {childList: true, subtree: true});

    core.events.on_node_addition = new kk.Event(key);
    core.events.on_node_removal = new kk.Event(key);
    core.events.on_mutation.addListener(mutations => {
        each (mutations, function(mutation) {
            each (mutation.addedNodes, element => {
                core.events.on_node_addition.dispatch(key, element);
            });
            each (mutation.removedNodes, element => {
                core.events.on_node_removal.dispatch(key, element);
            });
        });
    });

    core.events.on_element_addition = new kk.Event(key);
    core.events.on_node_addition.addListener(element => {
        if (kk.is_E(element))
            core.events.on_element_addition.dispatch(key, element);
    });

    core.events.on_element_removal = new kk.Event(key);
    core.events.on_node_removal.addListener(element => {
        if (kk.is_E(element))
            core.events.on_element_removal.dispatch(key, element);
    });
}
