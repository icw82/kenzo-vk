(function(kzvk){
'use strict';

var mod = {
    name: 'ui',
    version: '1.0.0'
};

mod.init = function(scope) {
    if (typeof scope !== 'string') return;

    if (scope === 'content') {
        if (kzvk.options.ui !== true) return false;

        mod.dom = {
            body: document.querySelector('body'),
            side_bar: document.querySelector('#side_bar')
        }

        if (kzvk.options.ui__kzvk_button) {
            var menu = mod.dom.side_bar.querySelector('ol');

            // Разделитель
            var delimiter = document.createElement('div');
            delimiter.classList.add('more_div');
            menu.appendChild(delimiter);

            // Кнопка
            var item = document.createElement('li');
            var url = chrome.runtime.getURL('options/template.html');
            item.innerHTML =
                '<a href="' + url + '" class="left_row" target="_blank">' +
                    '<span class="left_label inl_bl">' +
                        chrome.i18n.getMessage('ext_name') +
                    '</span>' +
                '</a>';

            menu.appendChild(item);
        }

        //mod.observe_dom();

        return true;
    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
