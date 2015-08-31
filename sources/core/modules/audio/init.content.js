(function(kzvk) {
'use strict';

var mod = kzvk.modules.audio;

mod.init.content = function() {
    if (kzvk.options.audio !== true) return;

    chrome.runtime.sendMessage({
        action: 'set audio provider key',
        key: mod.provider_key
    });

    kzvk.class_forever('kz-vk-audio', kzvk.dom.body);

    mod.observe_list();
    mod.observe_dom();
    mod.observe_downloads();
}

})(kzvk);
