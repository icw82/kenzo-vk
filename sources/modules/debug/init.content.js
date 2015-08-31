(function(kzvk) {
'use strict';

var mod = kzvk.modules.debug;

mod.init.content = function() {
    if (kzvk.options.debug__mode) {
        kzvk.class_forever('kz-vk-debug', kzvk.dom.body);
    }
}

})(kzvk);
