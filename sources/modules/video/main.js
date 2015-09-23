(function(kzvk){
'use strict';

var mod = new kzvk.Module('video');

mod.dependencies = ['provider'];
mod.list = []; // NOTE: На данный момент используется единственный элемент.
mod.button_classes = [
    'kz-format',
    'kz-progress',
    'kz-unavailable'
]

// Включение модуля
kzvk.modules[mod.name] = mod;

//FUTURE: (видео) Кнопки в мини-плеере;
//FUTURE: (видео) Определение источника видео при поиске;

})(kzvk);
