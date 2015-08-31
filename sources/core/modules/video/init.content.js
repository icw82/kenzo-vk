(function(kzvk) {
'use strict';

var mod = kzvk.modules.video;

mod.init.content = function() {
    if (kzvk.options.video !== true) return;

    kzvk.class_forever('kz-vk-video', kzvk.dom.body);

    mod.observe_list();
    mod.observe_dom();
    mod.observe_downloads();
}

})(kzvk);
