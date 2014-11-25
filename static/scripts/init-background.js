(function(){

'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

function init(){
    var modules = [
        'downloads'
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

if (kzvk.loaded){
    init();
} else {
    Object.observe(kzvk, load_observer);
}

})();
