(function(){

'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

if (typeof default_options == 'undefined'){
    console.warn('default_options не загружены');
    return false;
}

var q = [];

function on_load(){
    document.removeEventListener('DOMContentLoaded', on_load);
    window.removeEventListener('load', on_load);
    pre_init();
}

function pre_init(){
    q.push('options');
    chrome.storage.sync.get(default_options, function(options){
        kzvk.options = options;
        init('options');
    });

    q.push('globals');
    chrome.storage.local.get(default_globals, function(globals){
        kzvk.globals = globals;
        init('globals');
    });
}

function init(loaded){
    var pos = q.indexOf(loaded);

    if (pos > -1)
        q.splice(pos, 1);

    if (q.length === 0)
        kzvk.init();
}

if (document.readyState === 'complete'){
    pre_init();
} else {
    document.addEventListener('DOMContentLoaded', on_load, false);
    window.addEventListener('load', on_load, false);
}

})();
