(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'debug',
    version: '1.0.0'
};

mod.init = function(){
    mod.dom = {
        body: document.querySelector('body')
    }

    if (kzvk.options.debug){
        kzvk.class_forever('kz-vk-debug', mod.dom.body);
    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
