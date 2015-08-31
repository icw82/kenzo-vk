(function(kzvk){
'use strict';

var mod = new kzvk.Module('audio');

mod.list = [] // временно здесь?
mod.audio_item_classes = [
    'kz-bitrate',
    'kz-progress',
    'kz-unavailable'
]
mod.provider_key = kzvk.make_key();

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
