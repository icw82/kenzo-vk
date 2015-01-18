(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'audio',
    version: '1.0.0',
    list: [], // временно здесь?
    audio_item_classes: [
        'kz-bitrate',
        'kz-progress',
        'kz-unavailable'
    ]
};

mod.init = function(){
    if (kzvk.options.audio !== true) return false;

    mod.dom = {
        body: document.querySelector('body')
    }

    kzvk.class_forever('kz-vk-audio', mod.dom.body);

    mod.observe_list();
    mod.observe_dom();
    mod.observe_downloads();

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
