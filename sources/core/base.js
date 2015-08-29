var kzvk = (function() {
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

// вероятность коллизии примерно 1 к 3*10^64
_.make_key = function () {
    var key = '';

    each (15, function () {
        key += String.fromCharCode(kenzo.rand(19968, 40869));
    });

    return key;
}

var goals = ['options', 'globals'];

function goal(item) {
    var index = goals.indexOf(item);
    if (index > -1) {
        goals.splice(index, 1);
    }

    if (goals.length === 0)
        _.loaded = true;
}

chrome.storage.sync.get(default_options, function(options) {
    _.options = options;
    console.info('KZVK: current options', options);
    goal('options');
});

chrome.storage.local.get(default_globals, function(globals) {
    chrome.storage.local.set(globals, function() {
        // _.globals = globals;
        console.info('KZVK: current globals', globals);
        goal('globals');
    });
});

// Прослушивание изменений настроек и глобальных переменных
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName == 'sync') {
        chrome.storage.sync.get(default_options, function(options) {
            _.options = options;
        });
    }
});

_.init = function(scope) {
    // TODO: Заменить все mod.dom на kzvk.dom
    _.dom = {
        body: document.querySelector('body')
    }


    // 1. Ожидание загрузки контента DOM
    if (document.readyState === 'complete') {
        pre_init();
    } else {
        document.addEventListener('DOMContentLoaded', on_load, false);
        window.addEventListener('load', on_load, false);
    }

    function on_load() {
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        pre_init();
    }


    // 2. Инициировать, только когда данные из хранилищ загрушены
    function pre_init() {
        if (kzvk.loaded)
            init();
        else
            Object.observe(kzvk, load_observer);
    }

    function init() {
        if (scope === 'content')
            init__content();
        else if (scope === 'backround')
            init__background();

        init__modules(scope);
    }

    function load_observer(changes) {
        each (changes, function(item) {
            if ((item.name == 'loaded') && kzvk.loaded) {
                Object.unobserve(kzvk, load_observer);
                init();
            }
        });
    }
}

function init__content() {
    // Тестирование безопасности
    //var eve = document.createElement('script');
    //eve.setAttribute('src', chrome.extension.getURL('scripts/eve.js'));
    //document.body.appendChild(eve);

    // Встраивание векторной графики

    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('images/graphics.svg'), true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState !== 4) return false;
        if (xhr.status === 200){
            var self = this;

            var container = document.createElement('div');
            container.style.display = 'none';
            container.innerHTML = self.response;
            document.body.appendChild(container);
        }
    }

    xhr.send(null);
}

function init__background() {

}

// Инициация модулей
function init__modules(scope) {
    if (typeof scope !== 'string') return;

    for (var mod in _.modules) {
        if (typeof _.modules[mod].init == 'function') {
            if (_.modules[mod].init(scope) === true)
                console.info('Инициация модуля', mod);
        }
    };
}

return _;

})();
