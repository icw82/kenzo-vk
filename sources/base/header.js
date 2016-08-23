'use strict';

const ext = (function() {

    const manifest = chrome.runtime.getManifest();

    const ext = {
        name: manifest.name,
        version: manifest.version,
        options: null,
        modules: {}
    };

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


    // DEFAULTS
    {
        let options = {
            filters: true,
            filters__square_brackets: true,
            filters__curly_brackets: true,
            download_button__simplified: false
        }

        ext.defaults = {
            base: {
                keys: []
            },
            downloads: [],
            downloads__history: [],
            downloads__count: 1,
            scrobbler__buffer: [],
            scrobbler__session: {}
        }
    }

    return ext;

})();
