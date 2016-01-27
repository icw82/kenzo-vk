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


    this.init = function() {
        var self = this;
        var init_for_scope = self['init__' + ext.scope];

        if (typeof init_for_scope === 'function') {
            var remove = [];
            each (self.dependencies, function(module_name) {
                // Если модуль загружен быстре, чем инициирован зависимый модуль
                if (module_name in ext.modules && ext.modules[module_name].loaded) {
                    remove.push(module_name);
                }
            }, function() {
                if (remove.length < 1) return;
                each (remove, function(module_name) {
                    var index = self.dependencies.indexOf(module_name);
                    if (index >= 0) {
                        self.dependencies.splice(index, 1);
                    }
                });
            });

            try_init();

            if (!self.initiated) {
                ext.events.on_module_load.addListener(check);
            }
        }

        function check(module_name) {

            if (self.name === 'ui')
                self.log('**module_name', module_name);

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

    this.dom_observers = [];

    this.init_dom_observers = function() {
        var self = this;

        if (self.dom_observers.length < 1) {
            self.warn('Слушатели не обнаружены')
            return;
        }

        // Primary
        each (self.dom_observers, function(item) {
            if (ext.options[item.option_name] === true)
                item.primary();
        });

        var new_nodes_observer = new MutationObserver(function(mutations) {
            each (mutations, function(mr) {
                each (mr.addedNodes, new_nodes_listner);
                //each (mr.removedNodes, remove_nodes_listner);
            });
        });

        new_nodes_observer.observe(document, {childList: true, subtree: true});

        function new_nodes_listner(element) {
            if (!(element instanceof Element)) return false;

            each (self.dom_observers, function(item) {
                if (
                    ext.options[item.option_name] === true &&
                    typeof item.for_observer == 'function'
                ) {
                    item.for_observer(element);
                }
            });
        };

    };

    var prefix = this.full_name + ' (' + ext.s + ') —';

    this.log = function() {
        if (!ext.options)
            console.warn('Неподходящее место, настройки не загружены');

        else if (ext.options.debug__log) {
            let args = Array.prototype.slice.call(arguments);
            args.unshift(prefix);
            console.log.apply(console, args);
        }
    }

    this.warn = function(message, value) {
        if (!ext.options)
            console.warn('Неподходящее место');

        else if (ext.options.debug__log) {
            let args = Array.prototype.slice.call(arguments);
            args.unshift(prefix);
            console.warn.apply(console, args);
        }
    }
}
