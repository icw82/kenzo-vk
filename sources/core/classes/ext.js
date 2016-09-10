class Extention {
    constructor() {
        const manifest = chrome.runtime.getManifest();
        const self = this;

        this.name = manifest.name;
        this.version = manifest.version;
        core.utils.local_console(this, this.name);

        this.modules = {};
        this.defaults = {
            _: {
                options: {},
                keys: []
            }
        };
        this.storage = this.defaults;
        this.options = this.storage.options;

        this.initiated = false;
        this.loaded = false;

    }

    init() {
        const self = this;

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
                self.defaults[mod.name] = mod.defaults;
            } else {
                delete self.modules[name];
            }
        }

        const load_storage = new Promise((resolve, reject) => {
            const flat_defaults = core.utils.object_to_flat(self.defaults);
//            ext.info('flat_defaults', flat_defaults);
            chrome.storage.local.get(flat_defaults, storage => {
                chrome.storage.local.set(storage, () => resolve(storage));
            });
        });

        load_storage.then(storage => {
//            ext.info('flat storage', storage);
            self.storage = core.utils.flat_to_object(storage);
            ext.info('Storage', self.storage);

            // Слушатель хранилища
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'local') {
                    changes = core.utils.flat_to_object(changes);

                    for (let name in changes) {
                        if (name === 'base') {

                        } else {
                            if (name in ext.modules) {
                                let mod = ext.modules[name];
                                mod.on_storage_changed.dispatch(changes[name]);
                            }
                        }
                    }

                    ext.info('Storage onChanged', changes);
                }
            });

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

            // TODO: Базовые модули

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
