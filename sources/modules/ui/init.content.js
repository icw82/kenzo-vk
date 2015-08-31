(function(kzvk){
'use strict';

var mod = kzvk.modules.ui;

mod.init.content = function() {
    if (kzvk.options.ui !== true) return;

    kzvk.dom.side_bar = document.querySelector('#side_bar');

    if (kzvk.options.ui__kzvk_button) {
        var menu = kzvk.dom.side_bar.querySelector('ol');

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

}

})(kzvk);
