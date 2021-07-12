// TODO: удалять настройки, у которых нет значений по умолчанию? Чтобы не оставался мусор.

// TODO: Опробовать веб-компоненты;
// TODO: Скачивание блоками или всего плейлиста;

//FUTURE: Обнаружение аудиозаписей-клонов;
//FUTURE: Правильный фильтр, чтобы вместо flume не выдавал lumen;
//FUTURE: Фильтры: битрейт, продолжительность, размер файла;

//FUTURE: Определение URL и продолжительности аудиозаписи без информации в DOM (Как?);
//FUTURE: Кнопка в аудио-плеере;
//FUTURE: Пометка уже скачанных аудиозаписей;

mod.dependencies = ['common'];

mod.defaults.options = {
    _: true,
    download_button: true,
    hide_hq_label: true,
    separator: core.utils.choose_a_locale({
        en: '–',
        ru: '—'
    }),
    track_numbers: false // TODO: Номера аудиозаписей в посте
};
