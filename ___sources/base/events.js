(function(ext) {

const key = kk.generate_key(10);

const events = {
    on_module_init: new kk.Event(),
    on_module_loaded: new kk.Event(),
};

events.on_content_loaded = new kk.Event(key);
{
    let on_loaded = () => {
        document.removeEventListener('DOMContentLoaded', on_loaded);
        window.removeEventListener('load', on_loaded);
        events.on_content_loaded.complete();
    }

    if (document.readyState === 'complete') {
        events.on_content_loaded.complete();

    } else {
        document.addEventListener('DOMContentLoaded', on_loaded, false);
        window.addEventListener('load', on_loaded, false);
    }
}

events.on_mutation = new kk.Event(key);
{
    let DOM_observer = new MutationObserver(function(mutations) {
        events.on_mutation.dispatch(key, mutations);
    });
    DOM_observer.observe(document, {childList: true, subtree: true});
}

events.on_node_addition = new kk.Event(key);
events.on_node_removal = new kk.Event(key);
events.on_mutation.addListener(mutations => {
    each (mutations, function(mutation) {
        each (mutation.addedNodes, element => {
            events.on_node_addition.dispatch(key, element);
        });
        each (mutation.removedNodes, element => {
            events.on_node_removal.dispatch(key, element);
        });
    });
});

events.on_element_addition = new kk.Event(key);
events.on_node_addition.addListener(element => {
    if (kk.is_E(element))
        events.on_element_addition.dispatch(key, element);
});

events.on_element_removal = new kk.Event(key);
events.on_node_removal.addListener(element => {
    if (kk.is_E(element))
        events.on_element_removal.dispatch(key, element);
});

// Изменение URL (Пока разработчики не родили нормальный тригер изменения url)
events.on_change_location = new kk.Event(key);
if (core.scope === 'content') {

    let period = 50;
    let interval_id = false;
    let correspondence = [
        ['scheme', 'protocol'],
        ['host', 'hostname'],
        ['port', 'port'],
        ['path', 'pathname'],
        ['query', 'search'],
        ['fragment', 'hash']
    ];

    let last_state = {};

    let check = function() {
        if (!last_state.url) {
            last_state.url = window.location.href;

            each (correspondence, item => {
                last_state[item[0]] = window.location[item[1]];
            });

        } else {
            if (last_state.url === window.location.href)
                return;

            let changes = [];

            each (correspondence, item => {
                if (last_state[item[0]] !== window.location[item[1]]) {
                    changes.push(item[0]);
                    last_state[item[0]] = window.location[item[1]];
                }
            });

            last_state.url = window.location.href;

            if (changes.length > 0) {
                events.on_change_location.dispatch(key, changes);
            }
        }
    }

    let start = () => {
        if (interval_id === false)
            interval_id = setInterval(check, period);
    }

    let stop = () => {
        clearInterval(interval_id);
        last_state = {};
        interval_id = false;
    }

    start();
}

ext.events = events;

})(ext);
