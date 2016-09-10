class Module {
    constructor (name, ext) {
        const self = this;

        if (name === '_') {
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

                each (core.scopes, scope => {
                    if (core.scope === scope) {
                        const init = self['init__' + scope];
                        kk.is_f(init) && init();
                        return true;
                    }
                })

                init_submodules();

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
