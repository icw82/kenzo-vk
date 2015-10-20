var kzvk = (function() {
'use strict';

var manifest = chrome.runtime.getManifest();

var kzvk = {
    name: manifest.name,
    version: manifest.version,
    options: null,
    modules: {}
};

// Вероятность коллизии примерно 1 к 3*10^64
kzvk.make_key = function () {
    var key = '';

    each (15, function () {
        key += String.fromCharCode(kk.rand(19968, 40869));
    });

    return key;
}

kzvk.events = {
    on_module_init: new chrome.Event(),
    on_module_load: new chrome.Event()
}

if (location.protocol === 'chrome-extension:') {
    if (location.pathname === '/_generated_background_page.html') {
        kzvk.scope = 'background';
        kzvk.s = 'bg';
    } else {
        // для страницы настроек?
    }
} else {
    kzvk.scope = 'content';
    kzvk.s = 'cs';
}

kzvk.choose_a_locale = function(options) {
    var ui_language = chrome.i18n.getUILanguage();

    if (typeof options == 'object') {
        if (options[ui_language]) {
            return options[ui_language];
        } else if (options.ru) {
            return options.ru;
        } else {
            for (key in options) {
                return options[key];
            }
        }
    }
}

kzvk.default_options = {
    filters: true,
    filters__square_brackets: true,
    filters__curly_brackets: true
}

/*
    Структура объекта storage: {
        резервный_options: {
            название_модуля_А: {любой тип данных},
            название_модуля_А__параметр_А: {любой тип данных},
            название_модуля_А__параметр_Б: {любой тип данных},
            …
            название_модуля_Б: {любой тип данных},
            название_модуля_Б__параметр_А: {любой тип данных},
            …
        },
        объект_А (downloads): {

        },

        объект_А__подобъект (downloads__history): {
            Если нужно отслеживать именно этот подобъект.
        },
        …
    }
*/
kzvk.default_globals = {
    options: {},
    base: {
        keys: []
    },
    audio: {
        now_playing: null
    },
    downloads: {
        history: [],
        current: []
    },
    scrobbler: {
        session: null,
        buffer: []
    }
}

// FIX: повторяющийся код
kzvk.log = function(message, value) {
    if (!kzvk.options || !kzvk.options.debug__log) return;
    if (typeof value === 'undefined')
        console.log(kzvk.name + ' (' + kzvk.s + ') —', message);
    else
        console.log(kzvk.name + ' (' + kzvk.s + ') —', message, value);
}

kzvk.warn = function(message, value) {
    if (!kzvk.options || !kzvk.options.debug__log) return;
    if (typeof value === 'undefined')
        console.warn(kzvk.name + ' (' + kzvk.s + ') —', message);
    else
        console.warn(kzvk.name + ' (' + kzvk.s + ') —', message, value);
}

// FUTURE: Запилить опцию debug__flood в настройках
kzvk.flood = function(message, value) {
    if (!kzvk.options || !kzvk.options.debug__flood) return;
    if (typeof value === 'undefined')
        console.log(kzvk.name + ' (' + kzvk.s + ') —', message);
    else
        console.log(kzvk.name + ' (' + kzvk.s + ') —', message, value);
}

// Класс модуля
kzvk.Module = function(name) {
    this.name = name;
    this.full_name = kzvk.name + ': ' + this.name;
    this.initiated = false;
    this.loaded = false;
    // FUTURE: версии модулей
    //this.version: '1.0.0',
    this.dependencies = []; // Модули, котрые должны работать до запуска данного модуля.

    function get_options(name, source) {
        if (!source) throw new Error('Неправильный тип данных');

        let output = {};

        for (let key in source) {
            if (key.indexOf(name) == 0) {
                if (key.length === name.length)
                    output._ = source[key];
                else
                    output[ key.substr(name.length + 2) ] = source[key];
            }
        }

        return output;
    }

    function set_options(name, new_value, target) {
        //
    }

    Object.defineProperty(this, 'default_options', {
        // Яндекс пока не понимает стрелочные функции.
        get: function() {
            return get_options(this.name, kzvk.default_options);
        },
        set: function(new_value) {
            if (typeof new_value !== 'object') throw new Error('Неправильный тип данных');
            if (new_value instanceof Array) throw new Error('Неправильный тип данных');

            for (let key in new_value) {
                let new_key = this.name
                if (key !== '_')
                    new_key += '__' + key;

                kzvk.default_options[new_key] = new_value[key];
            }
        }
    });

    Object.defineProperty(this, 'options', {
        get: function() {
            return get_options(this.name, kzvk.options);
        }//,
        //set: funciton(new_value) { }
    });


    this.init = function(as_promise) {
        var self = this;
        var init_for_scope = self['init__' + kzvk.scope];

        if (typeof init_for_scope === 'function') {
            try_init();

            if (!self.initiated) {
                kzvk.events.on_module_load.addListener(check);
            }
        }

        function check(module_name) {
            if (typeof module_name !== 'string') return;
            var index = self.dependencies.indexOf(module_name);
            if (index >= 0) {
                self.dependencies.splice(index, 1);
                try_init();
            }
        }

        function try_init() {
            if (self.dependencies.length > 0) return;
            kzvk.events.on_module_load.removeListener(check);

            init_for_scope();

            self.dispatch_init_event();
        }
    }

    this.dispatch_init_event = function() {
        this.initiated = true;
        if (!this.loaded)
            this.log('Модуль инициирован');
        kzvk.events.on_module_init.dispatch(this.name);
    }

    this.dispatch_load_event = function() {
        this.loaded = true;
        this.log('Модуль загружен');
        kzvk.events.on_module_load.dispatch(this.name);
    }

    var prefix = this.full_name + ' (' + kzvk.s + ') —';

    this.log = function(message, value) {
        if (!kzvk.options || !kzvk.options.debug__log) return;
        if (typeof value === 'undefined')
            console.log(prefix, message);
        else
            console.log(prefix, message, value);
    }

    this.warn = function(message, value) {
        if (!kzvk.options || !kzvk.options.debug__log) return;
        if (typeof value === 'undefined')
            console.warn(prefix, message);
        else
            console.warn(prefix, message, value);
    }
}

var load_content = function(resolve, reject) {
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
};

var load_storage__sync = function(resolve, reject) {
    chrome.storage.sync.get(kzvk.default_options, function(options) {
        kzvk.options = options;

        // Прослушивание изменений настроек
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (areaName == 'sync') {
                chrome.storage.sync.get(kzvk.default_options, function(options) {
                    kzvk.options = options;
                });
            }
        });

        console.info(kzvk.name + ' — current options', kzvk.options);
        resolve();
    });
};

var load_storage__local = function(resolve, reject) {
    chrome.storage.local.get(kzvk.default_globals, function(globals) {
        // Set нужен, так как kzvk.globals не используется, в отличие от kzvk.options
        chrome.storage.local.set(globals, function() {
            console.info(kzvk.name + ' — current globals', globals);
            resolve();
        });
    });
};

kzvk.init = function() {
    console.info(kzvk.name + ' — default options', kzvk.default_options);

    kzvk.dom = {
        body: document.querySelector('body')
    }

    Promise.all([
        new Promise(load_content),
        new Promise(load_storage__sync),
        new Promise(load_storage__local)
    ]).then(function() {
        if (kzvk.scope === 'content')
            init__content();
        else if (kzvk.scope === 'backround')
            init__background();

        init__modules();
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
function init__modules() {

    // FUTURE: Проверка на ацикличность графа зависимостей

    for (var key in kzvk.modules) {
        if (!(kzvk.modules[key] instanceof kzvk.Module)) continue;

        kzvk.modules[key].init();
    }

    // FUTURE: Promise.chain([ [*, *], [*, *], * ]);
}

return kzvk;

// FUTURE: banlist;

})();
