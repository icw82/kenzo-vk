(function(kzvk){
'use strict';

var mod = {
    name: 'video',
    version: '2.0.0',
    list: [],
    button_classes: [
        'kz-format',
        'kz-progress',
        'kz-unavailable'
    ]
};

mod.init = function(scope) {
    if (typeof scope !== 'string') return;

    if (scope === 'content') {
        if (kzvk.options.video !== true) return false;

        mod.dom = {
            body: document.querySelector('body')
        };

        kzvk.class_forever('kz-vk-video', mod.dom.body);

        mod.observe_list();
        mod.observe_dom();
        mod.observe_downloads();

        return true;
    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
