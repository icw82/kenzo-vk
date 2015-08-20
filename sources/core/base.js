var kzvk = (function(){
'use strict';

// element, node — обязательно DOM Element
// item — элемент списка.

//    "browser_action": {
//        "default_icon": {
//            "19": "icons/19.png",
//            "38": "icons/38.png"
//        }
//    },

var manifest = chrome.runtime.getManifest();

var _ = {
    name: manifest.name,
    version: manifest.version,
    options: null,
    modules: {},
    loaded: false
};

_.make_key = function(){
    var _ = '';

    each (15, function(){
        _ += String.fromCharCode(kenzo.rand(19968, 40869));
    });

    return _;
}

var goals = ['options', 'globals'];

function goal(item){
    var index = goals.indexOf(item);
    if (index > -1){
        goals.splice(index, 1);
    }

    if (goals.length === 0)
        _.loaded = true;
}

chrome.storage.sync.get(default_options, function(options){
    _.options = options;
    goal('options');
});

chrome.storage.local.get(default_globals, function(globals){
    chrome.storage.local.set(globals, function(){
        // _.globals = globals;
        goal('globals');
    });
});

// Прослушивание изменений настроек и глобальных переменных
chrome.storage.onChanged.addListener(function(changes, areaName){
    if (areaName == 'sync') {
        chrome.storage.sync.get(default_options, function(options){
            _.options = options;
        });
    }
});

_.init = function(names){
    if (typeof names === 'string')
        names = [names];

    if (names instanceof Array){
        each (names, function(name){
            if ((name in _.modules) && (typeof _.modules[name].init == 'function')){
                console.info('Инициация модуля', name);
                _.modules[name].init();
            }
        });
    } else {
        for (var mod in _.modules){
            if (typeof _.modules[mod].init == 'function'){
                console.info('Инициация модуля', mod);
                _.modules[mod].init();
            }
        };
    }
}

return _;

})();
