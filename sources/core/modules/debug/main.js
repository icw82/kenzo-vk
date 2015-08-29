(function(kzvk){
'use strict';

var mod = {
    name: 'debug',
    version: '1.0.0'
};

mod.init = function(scope) {
    if (typeof scope !== 'string') return;

    if (scope === 'content') {
        mod.dom = {
            body: document.querySelector('body')
        }

        if (kzvk.options.debug__mode) {
            kzvk.class_forever('kz-vk-debug', mod.dom.body);
        }

        return true;
    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
