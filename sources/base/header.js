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

    ext.default_options = {
        filters: true,
        filters__square_brackets: true,
        filters__curly_brackets: true,
        download_button__simplified: false
    }

/*
    Структура объекта storage: {
        резервный_options: {
            название_модуля_А: {любой тип данных},
            название_модуля_А__параметр_А: {любой тип данных},
            название_модуля_А__параметр_Б: {любой тип данных},
            …
            название_модуля_Б: {любой тип данных},
            название_модуля_Б__параметр_А: {любой тип данных},
            …
        },
        объект_А (downloads): {

        },

        объект_А__подобъект (downloads__history): {
            Если нужно отслеживать именно этот подобъект.
        },
        …
    }
*/

    ext.default_globals = {
        options: {},
        base: {
            keys: []
        },
        downloads: [],
        downloads__history: [],
        downloads__count: 1,
        scrobbler__buffer: [],
        scrobbler__session: {}
    }

    return ext;

})();
