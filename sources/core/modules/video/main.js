(function(kzvk){
'use strict';

var mod = new kzvk.Module('video');

mod.list = [];
mod.button_classes = [
    'kz-format',
    'kz-progress',
    'kz-unavailable'
]

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
