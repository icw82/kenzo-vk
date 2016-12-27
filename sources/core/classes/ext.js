class Extention {
    constructor() {
        const manifest = chrome.runtime.getManifest();
        const self = this;

        this.name = manifest.name;
        this.version = manifest.version;
        core.utils.local_console(this, this.name);

        this.modules = {};
        this.defaults = {
            options: {},
            keys: []
        };

        core.storage.defaults._ = this.defaults;

        Object.defineProperty(this, 'storage', {
            get: () => {
                if ('_' in core.storage.data) {
                    return core.storage.data._;
                } else {
                    return this.defaults;
                }
            }
        });

        Object.defineProperty(this, 'options', {
            get: () => self.storage.options
        });

        this.initiated = false;
        this.loaded = false;
//        this.on_init = new kk.Event();
//        this.on_loaded = new kk.Event();
        this.on_storage_changed = new kk.Event();
    }

    init() {
        const self = this;

        this.initiated = true;
        this.info(this);
        this.dom = {};

        if (core.scope === 'content') {
            // Подключение Kenzo Kit к странице
            core.utils.inject_to_dom('js', chrome.extension.getURL('scripts/kk.min.js'));

            // Подключение стилей
            const modes = [2016, 'm'];

            each (modes, name => {
                if (ext.mode === name) {
                    let url = chrome.extension.getURL('styles/ext.' + name + '.css')
                    if (url)
                        core.utils.inject_to_dom('css', url);
                    return true;
                }
            });

            // Встраивание векторной графики
            core.utils.inject_to_dom('svg', chrome.extension.getURL('images/graphics.svg'));
        }

        for (let name in self.modules) {
            let mod = self.modules[name];
            if (mod instanceof core.Module) {
                core.storage.defaults[mod.name] = mod.defaults;
            } else {
                delete self.modules[name];
            }
        }

        core.storage.init().then(() => {
            self.loaded = true;
//            console.log('Хранилище инициировано');
            if (each (core.scopes, scope => {
                if (core.scope === scope) {
                    const init = self['init__' + scope];
                    kk.is_f(init) && init();
                    return true;
                }
            })) {
                // Инициирование модулей
                init_modules();
            };
        });

        const init_modules = () => {
            // FUTURE: Проверка на ацикличность графа зависимостей
            // FUTURE: Promise.chain([ [*, *], [*, *], * ]);

            for (let name in self.modules) {
                let mod = self.modules[name];

                if (mod instanceof core.Module) {
                    self.defaults[name] = mod.defaults;
                    mod.init();
                }
            }
        }
    }
}

core.Extention = Extention;
