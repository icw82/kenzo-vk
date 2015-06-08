(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'trash',
    version: '2.0.0',
    observers: []
};

mod.init = function(){
    if (kzvk.options.trash !== true)
        return false;

    mod.dom = {
        body: document.querySelector('body'),
        trash_bin: document.createElement('div')
    };

    mod.dom.trash_bin.classList.add('kz-vk-trash__bin');
    mod.dom.body.insertBefore(mod.dom.trash_bin, mod.dom.body.firstChild);

    mod.observe_dom();
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
