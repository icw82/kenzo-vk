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

mod.list = [] // временно здесь?
mod.audio_item_classes = [
    'kz-bitrate',
    'kz-progress',
    'kz-unavailable'
]
mod.provider_key = kk.generate_key();

// Включение модуля
ext.modules[mod.name] = mod;

// fix: прогрессбар в проигрываемом треке (репост в ленте).

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
