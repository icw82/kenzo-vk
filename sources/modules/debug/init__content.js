(function(kzvk) {
'use strict';

var mod = kzvk.modules.debug;

mod.init__content = function() {
    if (!kzvk.options.debug) return;

    if (kzvk.options.debug__styles) {
        kzvk.class_forever('kz-vk-debug', kzvk.dom.body);
    }

    mod.dispatch_load_event();
}

})(kzvk);
