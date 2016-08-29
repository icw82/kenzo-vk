class Extention {
    constructor() {
        const manifest = chrome.runtime.getManifest();

        this.name = manifest.name;
        this.version = manifest.version;
        this.options = null;
        this.modules = {};

        core.utils.local_console(this, this.name);
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

        const load_storage = new Promise((resolve, reject) => {
            chrome.storage.local.get(ext.defaults, storage => {
                chrome.storage.local.set(storage, () => {
                    resolve(storage);
                });
            });
        });

        load_storage.then(storage => {
            ext.info('Storage', core.utils.flat_to_object(storage));

            // Слушатель хранилища
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'local') {
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
                if (self.modules[name] instanceof core.Module) {
                    self.modules[name].init();
                }
            }
        }
    }
}

core.Extention = Extention;
