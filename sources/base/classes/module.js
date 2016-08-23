// Класс модуля
class Module {
    constructor (name) {
        const self = this;

        this.name = name;
        this.ext = ext;
        this.full_name = ext.name + ': ' + this.name;
        this.initiated = false;
        this.loaded = false;
        this.submodules = {};

        this.dependencies = []; // Модули, которые должны работать до запуска данного модуля
        ext.utils.local_console(this, this.full_name);

        this.options = {};
        this.default_options = {};

//        ext.utils.object_to_flat();
//        ext.utils.flat_to_object();

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


    }

    init () {


    }

}

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
//
//    function set_options(name, new_value, target) {
//        //
//    }
//

//
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
//                let init_for_scope = sub['init__' + ext.scope];
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
//    this.init = function() {
//        const self = this;
//        const init_for_scope = self['init__' + ext.scope];
//
////        console.log('------', self.name, 'init__' + ext.scope);
//
//        if (typeof init_for_scope === 'function') {
//            var remove = [];
//            each (self.dependencies, function(module_name) {
//                // Если модуль загружен быстре, чем инициирован зависимый модуль
//                if (module_name in ext.modules && ext.modules[module_name].loaded) {
//                    remove.push(module_name);
//                }
//            }, function() {
//                if (remove.length < 1) return;
//                each (remove, function(module_name) {
//                    var index = self.dependencies.indexOf(module_name);
//                    if (index >= 0) {
//                        self.dependencies.splice(index, 1);
//                    }
//                });
//            });
//
//            try_init();
//
//            if (!self.initiated) {
//                ext.events.on_module_load.addListener(check);
//            }
//        }
//
//        function check(module_name) {
//            if (typeof module_name !== 'string') return;
//            var index = self.dependencies.indexOf(module_name);
//            if (index >= 0) {
//                self.dependencies.splice(index, 1);
//                try_init();
//            }
//        }
//
//        function try_init() {
//            if (self.dependencies.length > 0) return;
//            ext.events.on_module_load.removeListener(check);
//
//            init_for_scope();
//            init_submodules(self);
//
//            self.dispatch_init_event();
//        }
//    }
//
//    this.dispatch_init_event = function() {
//        this.initiated = true;
//        if (!this.loaded)
//            this.log('Модуль инициирован');
//        ext.events.on_module_init.dispatch(this.name);
//    }
//
//    this.dispatch_load_event = function() {
//        this.loaded = true;
//        this.log('Модуль загружен');
//        ext.events.on_module_load.dispatch(this.name);
//    }
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
//
//
//    this.on_content_load = new Promise(ext.promise__content_load);
//
//}

ext.Module = Module;
