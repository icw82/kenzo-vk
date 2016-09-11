mod.dependencies = ['file'];

mod.defaults.options = {
    _: true,
    download_button: true,
    replace_play_button: true,
    separator: core.utils.choose_a_locale({
        en: '–',
        ru: '—'
    })
}

mod.init__content = function() {
    if (mod.options._ !== true || !ext.mode)
        return;

    core.events.on_mutation.addListener(() => {
        let elements;
        let query;

        if (ext.mode === 2016) {
            query = '.audio_row';
        } else {
            return;
        }

        elements = kk.d.querySelectorAll(query);

        if (elements.length > 0) {
            let item = mod.registry.update(elements);
        }
    });

    mod.on_loaded.dispatch();
}

//mod.init__background = function() {
//    if (mod.options._ !== true)
//        return;
//
//    mod.on_loaded.dispatch();
//}

// TODO: удалять настройки, у которых нет значений по умолчанию? Чтобы не оставался мусор.

// TODO: Опробовать веб-компоненты;
// TODO: Скачивание блоками или всего плейлиста;

//FUTURE: Обнаружение аудиозаписей-клонов;
//FUTURE: Правильный фильтр, чтобы вместо flume не выдавал lumen;
//FUTURE: Фильтры: битрейт, продолжительность, размер файла;

//FUTURE: Определение URL и продолжительности аудиозаписи без информации в DOM (Как?);
//FUTURE: Кнопка в аудио-плеере;
//FUTURE: Пометка уже скачанных аудиозаписей;
