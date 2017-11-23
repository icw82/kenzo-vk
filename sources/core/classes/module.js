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

        Object.defineProperty(this, 'storage', {
            get: () => {
                if (this.name in core.storage.data) {
                    return core.storage.data[this.name];
                } else {
                    return this.defaults;
                }
            }
        });

        Object.defineProperty(this, 'options', {
            get: () => this.storage.options
        });

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
                self.log('Модуль инициирован', self);
            core.events.on_module_init.dispatch(self.name);

        });

        this.on_loaded.addListener(() => {
            self.loaded = true;
            self.log('Модуль загружен', self);
            core.events.on_module_loaded.dispatch(self.name);
        });

        ext.on_storage_changed.addListener(changes => {
            if (self.name in changes) {
                self.on_storage_changed.dispatch(changes[self.name]);
            }
        });
    }

    init () {
        const self = this;
        const init = this['init__' + core.scope];

        if (!kk.is_f(init)) {
            self.warn(`Модуль не инициируется в ${core.scope}`);
            return;
        }

        this.dom = {};
        this.dependencies = this.dependencies.filter(item => {
            if (!kk.is_s(item)) {
                console.error('Не корректное название модуля', item);
                return;
            }
            return item !== this.name;
        });

        // Замена названий модулей на ссылки
        self.dependencies = self.dependencies.map(module => {
            if (module in ext.modules)
                return ext.modules[module];

            throw new Error('Модуль «' + module + '» не обнаружен');
        });

        const iteration_limit = 20;
        let try_count = 0;

        const try_init = () => {
            if (try_count > self.iteration_limit) {
                core.events.on_module_loaded.removeListener(try_init);
                self.warn('Модуль не загружен');
                self.warn('Достигнут предел итераций', self);
                return;
            }

            const left = self.dependencies.filter(module => !module.loaded);

            if (left.length === 0) {
                core.events.on_module_loaded.removeListener(try_init);

                init();
                init_submodules();

                self.on_init.dispatch();
            }

            if (!self.initiated && try_count === 0) {
                core.events.on_module_loaded.addListener(try_init);
            }

            try_count++;
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
}

core.Module = Module;
