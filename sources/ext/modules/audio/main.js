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
}

mod.init__content = () => {
    if (mod.options._ !== true || !ext.mode)
        return;

    if (ext.mode === 2016) {

        core.events.on_content_loaded.addListener(() => {
            // Элементы аудио
            {
                const elements = kk.d.querySelectorAll('.audio_row');
                if (elements.length > 0)
                    mod.registry.update(elements);
            }

            // Кнопка перемешивания
            {
                const elements = kk.d.querySelectorAll(
                    '.audio_page__shuffle_all'
                );
                if (elements.length > 0)
                    elements.forEach(item => item.classList.add('kzvk'));

            }
        });

        const nodeHandler = node => {
            if (!kk.is.E(node)) {
                return;
            }

            // Элементы аудио
            if (node.classList.contains('audio_row')) {
                mod.registry.update(node);
            } else {
                const elements = node.querySelectorAll('.audio_row');
                if (elements.length > 0) {
                    mod.registry.update(elements);
                }
            }

            // Кнопка перемешивания
            if (node.classList.contains('audio_page__shuffle_all'))
                node.classList.add('kzvk');
            else {
                const elements =
                    node.querySelectorAll('.audio_page__shuffle_all');

                if (elements.length > 0) {
                    elements.forEach(item =>
                        item.classList.add('kzvk')
                    );
                }
            }

        }

        core.events.on_mutation.addListener(mutations => {

            const added = [];
            const removed = [];

            mutations.forEach(mutation => {
                if (mutation.addedNodes)
                    mutation.addedNodes.forEach(node => added.push(node));

                if (mutation.removedNodes)
                    mutation.removedNodes.forEach(node => removed.push(node));
            });

            if (added)
                added.forEach(nodeHandler);

            each (kk.d.querySelectorAll('.audio_w_covers'), element => {
                element.classList.remove('audio_w_covers');
            });

            each (kk.d.querySelectorAll('.audio_pl_edit_box'), element => {
                element.classList.add('kzvk-audio-playlist-edit');
            });

        });
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
