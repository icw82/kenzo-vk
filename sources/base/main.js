var ext = (function() {
'use strict';

var manifest = chrome.runtime.getManifest();

var ext = {
    name: manifest.name,
    version: manifest.version,
    options: null,
    modules: {}
};

ext.events = {
    on_module_init: new chrome.Event(),
    on_module_load: new chrome.Event()
}

// Определение контекста
if (location.protocol === 'chrome-extension:') {
    if (location.pathname === '/_generated_background_page.html') {
        ext.scope = 'background';
        ext.s = 'bg';
    } else {
        // для страницы настроек?
    }
} else {
    ext.scope = 'content';
    ext.s = 'cs';
}

ext.choose_a_locale = function(options) {
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

ext.default_options = {
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
ext.default_globals = {
    options: {},
    base: {
        keys: []
    }
}

// FIX: повторяющийся код
ext.log = function(message, value) {
    if (!ext.options || !ext.options.debug__log) return;
    if (typeof value === 'undefined')
        console.log(ext.name + ' (' + ext.s + ') —', message);
    else
        console.log(ext.name + ' (' + ext.s + ') —', message, value);
}

ext.warn = function(message, value) {
    if (!ext.options || !ext.options.debug__log) return;
    if (typeof value === 'undefined')
        console.warn(ext.name + ' (' + ext.s + ') —', message);
    else
        console.warn(ext.name + ' (' + ext.s + ') —', message, value);
}

// FUTURE: Запилить опцию debug__flood в настройках
ext.flood = function(message, value) {
    if (!ext.options || !ext.options.debug__flood) return;
    if (typeof value === 'undefined')
        console.log(ext.name + ' (' + ext.s + ') —', message);
    else
        console.log(ext.name + ' (' + ext.s + ') —', message, value);
}

// Класс модуля
ext.Module = function(name) {
    this.name = name;
    this.full_name = ext.name + ': ' + this.name;
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
        get: () => {
            return get_options(this.name, ext.default_options);
        },
        set: (new_value) => {
            if (typeof new_value !== 'object') throw new Error('Неправильный тип данных');
            if (new_value instanceof Array) throw new Error('Неправильный тип данных');

            for (let key in new_value) {
                let new_key = this.name
                if (key !== '_')
                    new_key += '__' + key;

                ext.default_options[new_key] = new_value[key];
            }
        }
    });

    Object.defineProperty(this, 'options', {
        get: () => {
            return get_options(this.name, ext.options);
        },
        set: (new_value) => { }
    });


    this.init = function(as_promise) {
        var self = this;
        var init_for_scope = self['init__' + ext.scope];

        if (typeof init_for_scope === 'function') {
            try_init();

            if (!self.initiated) {
                ext.events.on_module_load.addListener(check);
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
            ext.events.on_module_load.removeListener(check);

            init_for_scope();

            self.dispatch_init_event();
        }
    }

    this.dispatch_init_event = function() {
        this.initiated = true;
        if (!this.loaded)
            this.log('Модуль инициирован');
        ext.events.on_module_init.dispatch(this.name);
    }

    this.dispatch_load_event = function() {
        this.loaded = true;
        this.log('Модуль загружен');
        ext.events.on_module_load.dispatch(this.name);
    }

    var prefix = this.full_name + ' (' + ext.s + ') —';

    this.log = function(message, value) {
        if (!ext.options || !ext.options.debug__log) return;
        if (typeof value === 'undefined')
            console.log(prefix, message);
        else
            console.log(prefix, message, value);
    }

    this.warn = function(message, value) {
        if (!ext.options || !ext.options.debug__log) return;
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
    chrome.storage.sync.get(ext.default_options, function(options) {
        ext.options = options;

        // Прослушивание изменений настроек
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (areaName == 'sync') {
                chrome.storage.sync.get(ext.default_options, function(options) {
                    ext.options = options;
                });
            }
        });

        console.info(ext.name + ' — current options', ext.options);
        resolve();
    });
};

var load_storage__local = function(resolve, reject) {
    chrome.storage.local.get(ext.default_globals, function(globals) {
        // Set нужен, так как ext.globals не используется, в отличие от ext.options
        chrome.storage.local.set(globals, function() {
            console.info(ext.name + ' — current globals', globals);
            resolve();
        });
    });
};

ext.init = function() {
    console.info(ext.name + ' — default options', ext.default_options);

    ext.dom = {
        body: document.querySelector('body')
    }

    Promise.all([
        new Promise(load_content),
        new Promise(load_storage__sync),
        new Promise(load_storage__local)
    ]).then(function() {
        if (ext.scope === 'content')
            init__content();
        else if (ext.scope === 'backround')
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

    for (var key in ext.modules) {
        if (!(ext.modules[key] instanceof ext.Module)) continue;

        ext.modules[key].init();
    }

    // FUTURE: Promise.chain([ [*, *], [*, *], * ]);
}

// FUTURE: banlist;
