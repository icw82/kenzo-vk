//mod.dependencies = ['file'];

mod.defaults.options = {
    _: true,
    download_button: true,
    replace_play_button: true,
    separator: core.utils.choose_a_locale({
        en: '–',
        ru: '—'
    }),
    track_numbers: false // TODO: Номера аудиозаписей в посте
}

mod.init__content = () => {
    if (mod.options._ !== true || !ext.mode)
        return;

    const listener__2016 = () => {
        let elements = kk.d.querySelectorAll('.audio_row');

        if (elements.length > 0) {
            let item = mod.registry.update(elements);
        }
    }

    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(listener__2016);
    }

    mod.on_loaded.dispatch();
}

mod.init__background = function() {
    if (mod.options._ !== true)
        return;

    mod.on_loaded.dispatch();
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
