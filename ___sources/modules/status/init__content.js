mod.init__content = function() {

    mod.audio_provider_key = kk.generate_key(15);

    chrome.runtime.sendMessage({
        action: 'set audio provider key',
        key: mod.audio_provider_key
    });

//    if (ext.options.scrobbler)
        mod.audio(mod.audio_provider_key);

    mod.on_content_load.then(function() {
        ext.dom.header = document.body.querySelector('#page_header_cont');
        ext.dom.content = document.body.querySelector('#page_body');
        ext.dom.side_bar = document.body.querySelector('#side_bar');

        mod.dispatch_load_event();
    });
}
