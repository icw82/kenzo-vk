(function(){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

function init(){
    var modules = [
        'trash',
        'audio',
        'video',
        'debug'
    ];

    kzvk.init(modules);
}

function load_observer(changes){
    each (changes, function(item){
        if ((item.name == 'loaded') && kzvk.loaded){
            Object.unobserve(kzvk, load_observer);
            init();
        }
    });
}

function pre_init(){
    if (kzvk.loaded){
        init();
    } else {
        Object.observe(kzvk, load_observer);
    }
}

function on_load(){
    document.removeEventListener('DOMContentLoaded', on_load);
    window.removeEventListener('load', on_load);
    pre_init();
}

if (document.readyState === 'complete'){
    pre_init();
} else {
    document.addEventListener('DOMContentLoaded', on_load, false);
    window.addEventListener('load', on_load, false);
}

})();
