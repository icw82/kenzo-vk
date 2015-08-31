var kzvk = (function() {
'use strict';

var manifest = chrome.runtime.getManifest();

var _ = {
    name: manifest.name,
    version: manifest.version,
    options: null,
    modules: {}
//    loaded: false // xxx
};

// Вероятность коллизии примерно 1 к 3*10^64
_.make_key = function () {
    var key = '';

    each (15, function () {
        key += String.fromCharCode(kenzo.rand(19968, 40869));
    });

    return key;
}

// Класс модуля
_.Module = function(name) {
    this.name = name;
    this.full_name = kzvk.name + ': ' + this.name,
    //this.version: '1.0.0',
    //this.dependencies = [] // Пока без версий

    this.init = {
        content: null,
        background: null
    }
}

var load_content = new Promise(function(resolve, reject) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        document.addEventListener('DOMContentLoaded', on_load, false);
        window.addEventListener('load', on_load, false);
    }

    function on_load() {
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        resolve();
    }
});

var load_storage__sync = new Promise(function(resolve, reject) {
    chrome.storage.sync.get(default_options, function(options) {
        _.options = options;

        // Прослушивание изменений настроек
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (areaName == 'sync') {
                chrome.storage.sync.get(default_options, function(options) {
                    _.options = options;
                });
            }
        });

        console.info('KZVK: current options', options);
        resolve();
    });
});

var load_storage__local = new Promise(function(resolve, reject) {
    chrome.storage.local.get(default_globals, function(globals) {
        // Set нужен, так как kzvk.globals не используется, в отличие от kzvk.options
        chrome.storage.local.set(globals, function() {
            console.info('KZVK: current globals', globals);
            resolve();
        });
    });
});

// TODO: Автоматическое определение SCOPE
_.init = function(scope) {
    _.dom = {
        body: document.querySelector('body')
    }

    Promise.all([
        load_content,
        load_storage__sync,
        load_storage__local
    ]).then(function() {
        if (scope === 'content')
            init__content();
        else if (scope === 'backround')
            init__background();

        init__modules(scope);
    });
}

function init__content() {
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

// Инициирование модулей
function init__modules(scope) {
    if (typeof scope !== 'string') return;

    // TODO: Порядок запуска модулей
    for (var key in _.modules) {
        if (!(_.modules[key] instanceof _.Module)) return;

        var mod = _.modules[key];

        if ((scope in mod.init) && (typeof mod.init[scope] == 'function')) {
            console.info('Инициирование модуля', mod.name, '(' + scope + ')');
            mod.init[scope]();
        }
    }
}

return _;

})();
