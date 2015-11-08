mod.init__content = function() {
    if (ext.options.audio !== true) return;

    chrome.runtime.sendMessage({
        action: 'set audio provider key',
        key: mod.provider_key
    });

    kk.class_forever('kz-vk-audio', ext.dom.body);

    mod.observe_list();
    mod.observe_dom();
    mod.observe_downloads();

    mod.dispatch_load_event();
}
