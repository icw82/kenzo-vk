(function(kzvk) {
'use strict';

var mod = kzvk.modules.trash;

mod.init__content = function() {
    if (kzvk.options.trash !== true) return;

    kzvk.dom.trash_bin = document.createElement('div');

    kzvk.class_forever('kz-vk-trash', kzvk.dom.body);

    kzvk.dom.trash_bin.classList.add('kz-vk-trash__bin');
    kzvk.dom.body.insertBefore(kzvk.dom.trash_bin, kzvk.dom.body.firstChild);

    mod.observe_dom();

    mod.dispatch_load_event();
}

})(kzvk);
