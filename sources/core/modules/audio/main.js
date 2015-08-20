(function(kzvk){
'use strict';

var mod = {
    name: 'audio',
    version: '1.0.0',
    list: [], // временно здесь?
    audio_item_classes: [
        'kz-bitrate',
        'kz-progress',
        'kz-unavailable'
    ],
    provider_key: kzvk.make_key()
};

mod.init = function(){
    if (kzvk.options.audio !== true) return false;

    mod.dom = {
        body: document.querySelector('body')
    }

    chrome.runtime.sendMessage({
        action: 'set audio provider key',
        key: mod.provider_key
    });

    kzvk.class_forever('kz-vk-audio', mod.dom.body);

    mod.observe_list();
    mod.observe_dom();
    mod.observe_downloads();

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
