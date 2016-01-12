mod.dom_observers.push({
    option_name: 'ui__sidebar_button',
    primary: function() {
        mod.sidebar_button.create();

        // Вписать нормально в dom_observers
        var observer = new MutationObserver(function(mutations) {
            if (each (mutations, function(mr) {
                if (each (mr.addedNodes, function(element) {
                    if (ext.dom.side_bar.contains(element)) {
                        return true;
                    }
                }))
                    return true;
            })) {
//                mod.log('********************');
                mod.sidebar_button.create();
            };
        });

        observer.observe(document, {childList: true, subtree: true});

    }
});

mod.sidebar_button = (function() {
    var creation_time = 0;
    var block = false;
    var dom = {};

    var _ = {
        create: function() {
            if (block) return;
            if (dom.button && ext.dom.side_bar.contains(dom.button))
                return;
            if (Date.now() - creation_time < 100) {
                block = true;
                mod.warn('sidebar_button: Подозрение на зацикленность. Работа функции прекращена.');
                return;
            }

            var menu = ext.dom.side_bar.querySelector('ol');
            var delimiters = ext.dom.side_bar.querySelectorAll('.more_div');

            if (delimiters[0])
                menu.insertBefore(construct(), delimiters[0]);
            else
                menu.appendChild(construct());

            dom.button = menu.querySelector('.kz-sidebar_button');
            creation_time = Date.now();

        }
    };

    function construct() {
        var fragment = document.createDocumentFragment();

        // Разделитель
        var delimiter = document.createElement('div');
        delimiter.classList.add('more_div');
        fragment.appendChild(delimiter);

        // Кнопка
        var item = document.createElement('li');
        item.classList.add('kz-sidebar_button');
        var url = chrome.runtime.getURL('options/index.html');
        item.innerHTML =
            '<a href="' + url + '" class="left_row" target="_blank">' +
                '<span class="left_label inl_bl">' +
                    chrome.i18n.getMessage('ext_name') +
                '</span>' +
            '</a>';

        fragment.appendChild(item);

        return fragment;
    }

    return _;

})();
