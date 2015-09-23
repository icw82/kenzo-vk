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

// TODO: Размер файла;
// TODO: Унифицировать кнопку (код, стили и пр.)
// TODO: Опробовать веб-компоненты;

//TODO: Иконка ожидания скачивания;
//TODO: Скачивание блоками или всего плейлиста;

//FUTURE: Обнаружение аудиозаписей-клонов;
//FUTURE: Правильный фильтр, чтобы вместо flume не выдавал lumen;
//FUTURE: Фильтры: битрейт, продолжительность, размер файла;

//FUTURE: Определение URL и продолжительности аудиозаписи без информации в DOM (Как?);
//FUTURE: Кнопка в аудио-плеере;
//FUTURE: Пометка уже скачанных аудиозаписей;

})(kzvk);
