var mod = new ext.Module('audio');

mod.default_options = {
    _: true,
    cache: true,
    separator: ext.choose_a_locale({
        en: '–',
        ru: '—'
    }),
    progress_bars: true,
    simplified: false
}

mod.audio_item_classes = [
    'kz-bitrate',
    'kz-progress',
    'kz-unavailable'
]
mod.provider_key = kk.generate_key(15);

// TODO: to kk
mod.create_proxy = function(object, property, callback) {
    if (typeof property !== 'string') return;

    var proxy_property = '_' + property;

    object[proxy_property] = void(0);

    Object.defineProperty(object, property, {
        get: function() {return object[proxy_property]},
        set: function(new_value) {
            object[proxy_property] = new_value;
            callback(object, property);
        }
    });
}


// Включение модуля
ext.modules[mod.name] = mod;

// fix: прогрессбар в проигрываемом треке (репост в ленте).

// TODO: Унифицировать кнопку (код, стили и пр.)
// TODO: Опробовать веб-компоненты;

// TODO: Иконка ожидания скачивания;
// TODO: Скачивание блоками или всего плейлиста;

//FUTURE: Скрытие кнопки play;
//FUTURE: Обнаружение аудиозаписей-клонов;
//FUTURE: Правильный фильтр, чтобы вместо flume не выдавал lumen;
//FUTURE: Фильтры: битрейт, продолжительность, размер файла;

//FUTURE: Определение URL и продолжительности аудиозаписи без информации в DOM (Как?);
//FUTURE: Кнопка в аудио-плеере;
//FUTURE: Пометка уже скачанных аудиозаписей;
