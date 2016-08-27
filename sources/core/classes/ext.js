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
            each ([2016, 'm'], name => {
                if (ext.mode === name) {
                    let url = chrome.extension.getURL('styles/styles.' + name + '.css')
                    if (url)
                        core.utils.inject_to_dom('css', url);
                    return true;
                }
            });

            // Встраивание векторной графики
            core.utils.inject_to_dom('svg', chrome.extension.getURL('images/graphics.svg'));
        }

        const load_storage = new Promise((resolve, reject) => {
            chrome.storage.local.get(ext.defaults, globals => {
                chrome.storage.local.set(globals, () => {
                    resolve(globals);
                });
            });
        });

        load_storage.then(globals => {
            ext.info('Current globals', globals);

            each (['content', 'background'], scope => {
                if (core.scope === 'content') {
                    let init = self['init__' + scope];
                    kk.is_f(init) && init();
                    return true;
                }
            });

            //init__modules();
        });
    }
}

core.Extention = Extention;
