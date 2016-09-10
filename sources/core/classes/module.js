class Module {
    constructor (name, ext) {
        const self = this;

        if (name === 'base') {
            throw new Error('Недопустимое имя модуля');
        }

        this.name = name;
        this.ext = ext;
        this.full_name = ext.name + '.' + this.name;
        core.utils.local_console(this, this.full_name);

        this.submodules = {};
        this.defaults = {
            options: {}
        };
        this.storage = this.defaults;
        this.options = this.storage.options;

        this.initiated = false;
        this.loaded = false;
        this.on_init = new kk.Event();
        this.on_loaded = new kk.Event();
        this.on_storage_changed = new kk.Event();

        // Модули, которые должны работать до запуска данного модуля
        this.dependencies = [];

        this.on_init.addListener(() => {
            self.initiated = true;
            if (!self.loaded)
                self.log('Модуль инициирован');
            core.events.on_module_init.dispatch(self.name);

        });

        this.on_loaded.addListener(() => {
            self.loaded = true;
            self.log('Модуль загружен');
            core.events.on_module_loaded.dispatch(self.name);
        });

        this.on_storage_changed.addListener(changes => {
            //self.log(changes);
            self.update_storage();
        });
    }

    init () {
        const self = this;
        const init = this['init__' + core.scope];

        if (!kk.is_f(init))
            return;

        this.dom = {};
        this.dependencies = this.dependencies.filter(item => item !== this.name);
        this.update_storage();

        // Замена названий модулей на ссылки
        each (self.dependencies, (module, i) => {
            if (module in ext.modules) {
                self.dependencies[i] = ext.modules[module];
            } else {
                throw new Error('Модуль «' + module + '» не обнаружен');
            }
        });

        // сбор настрокек с подмодулей

        const try_init = () => {
            this.dependencies = this.dependencies.filter(module => !module.loaded);
//            this.log('Dependencies', self.dependencies);

            if (self.dependencies.length === 0) {
                core.events.on_module_loaded.removeListener(try_init);

                if (each (core.scopes, scope => {
                    if (core.scope === scope) {
                        const init = self['init__' + scope];
                        kk.is_f(init) && init();
                        return true;
                    }
                })) {
                    init_submodules(self);
                };

                self.on_init.dispatch();
            }

            if (!self.initiated) {
                core.events.on_module_loaded.addListener(try_init);
            }
        }

        const init_submodules = () => {
            for (let name in self.submodules) {
                let sub = self.submodules[name];

                if (sub instanceof core.SubModule) {
//                    self.defaults[name] = sub.defaults;
                    sub.init();
                }
            }
        }

        try_init();
    }

    update_storage() {
        if (this.name in this.ext.storage) {
            this.storage = this.ext.storage[this.name];
            if ('options' in this.storage) {
                this.options = this.storage.options;
            }
        }
    }
}

core.Module = Module;

// Класс модуля

//
//        this.options = {};
//        this.default_options = {};


//        Object.defineProperty(this, 'default_options', {
//            get: () => {
//                return get_options(this.name, ext.default_options);
//            },
//            set: (new_value) => {
//                if (typeof new_value !== 'object')
//                    throw new Error('Неправильный тип данных');
//                if (new_value instanceof Array)
//                    throw new Error('Неправильный тип данных');
//
//                for (let key in new_value) {
//                    let new_key = this.name
//                    if (key !== '_')
//                        new_key += '__' + key;
//
//                    ext.defaults.options[new_key] = new_value[key];
//                }
//            }
//        });
//
//
//    }

//}

//    function get_options(name, source) {
//        if (!source) throw new Error('Неправильный тип данных');
//
//        let output = {};
//
//        for (let key in source) {
//            if (key.indexOf(name) == 0) {
//                if (key.length === name.length)
//                    output._ = source[key];
//                else
//                    output[ key.substr(name.length + 2) ] = source[key];
//            }
//        }
//
//        return output;
//    }

//    Object.defineProperty(this, 'options', {
//        get: () => {
//            return get_options(this.name, ext.options);
//        },
//        set: (new_value) => { }
//    });
//
//    function init_submodules(mod) {
//        for (let name in mod.submodules) {
//            if (mod.submodules[name] instanceof ext.SubModule) {
//                let sub = mod.submodules[name];
//                let init_for_scope = sub['init__' + core.scope];
//
//                if (kk.is_f(init_for_scope)) {
//                    if (!sub.initiated) {
//                        sub.initiated = true;
//                        init_for_scope();
//                    }
//                }
//            }
//        }
//    }
//
//    this.init = function()
//

//
//    // Подмодули
//
//
//
//
//    // TODO: Переписать
//
//    this.dom_observers = [];
//
//    this.init_dom_observers = function() {
//
////        console.warn('УСТАРЕЛО')
//
//        var self = this;
//
//        if (self.dom_observers.length < 1) {
//            self.warn('Слушатели не обнаружены')
//            return;
//        }
//
//        // Primary
//        this.on_content_load.then(function() {
//            each (self.dom_observers, function(item) {
//                if (ext.options[item.option_name] === true)
//                    item.on_content_load();
//            });
//        });
//
//        // TODO: Нужно дать возможность обзёрверу самому разобраться с мутациями
//        // Проблема: когда нужно запустить функцию один раз при первой положительной проверке
//        //           чтобы сэкономить ресурсы (когда не имеет смысла дальнейший перебор мутаций)
//
//        var new_nodes_observer = new MutationObserver(function(mutations) {
//            each (mutations, function(mr) {
//                each (mr.addedNodes, new_nodes_listner);
//                //each (mr.removedNodes, remove_nodes_listner);
//            });
//        });
//
//        new_nodes_observer.observe(document, {childList: true, subtree: true});
//
//        function new_nodes_listner(element) {
//            if (!(element instanceof Element)) return;
//
//            each (self.dom_observers, function(item) {
//                if (
//                    ext.options[item.option_name] === true &&
//                    typeof item.for_observer == 'function'
//                ) {
//                    item.for_observer(element);
//                }
//            });
//        };
//
//    };
//
//    this.on_content_load = new Promise(ext.promise__content_load);

//}
