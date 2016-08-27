var mod = new ext.Module('audio');

mod.dependencies = ['file'];

mod.default_options = {
    _: true,
    download_button: true,
    replace_play_button: true,
    separator: core.utils.choose_a_locale({
        en: '–',
        ru: '—'
    })
}

// TODO: удалять настройки, у которых нет значений по умолчанию? Чтобы не оставался мусор.

// TODO: Опробовать веб-компоненты;
// TODO: Скачивание блоками или всего плейлиста;

//FUTURE: Обнаружение аудиозаписей-клонов;
//FUTURE: Правильный фильтр, чтобы вместо flume не выдавал lumen;
//FUTURE: Фильтры: битрейт, продолжительность, размер файла;

//FUTURE: Определение URL и продолжительности аудиозаписи без информации в DOM (Как?);
//FUTURE: Кнопка в аудио-плеере;
//FUTURE: Пометка уже скачанных аудиозаписей;
