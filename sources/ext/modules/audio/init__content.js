mod.init__content = () => {
    if (mod.options._ !== true || !ext.mode)
        return;

    mod.registry = new AudioRegistry();

    if (ext.mode === 2016) {
        // При первой загрузке
        core.events.on_content_loaded.addListener(() => {
            // Элементы аудио
            handleAudioElement(ext.dom.vk.body);

            // Кнопка перемешивания
            handleShuffleButton(ext.dom.vk.body);

        });

        // Слушает мутации страницы, отлавлвиает связанное с аудио
        core.events.on_mutation.addListener(mutations => {
            mutations.forEach(mutation => {
                if (mutation.removedNodes.length > 0) {
                    has_removed = true;
                }

                mutation.addedNodes.forEach(node => {
                    // Элементы аудио
                    handleAudioElement(node);

                    // Кнопка перемешивания
                    handleShuffleButton(node);
                });
            });

            if (has_removed) {
                mod.registry.clean();
            }

            // console.log(`--`, mod.registry[0]);

//            each (kk.d.querySelectorAll('.audio_pl_edit_box'), element => {
//                element.classList.add('kzvk-audio-playlist-edit');
//            });
        });

        const handleAudioElement = node => {
            if (!kk.is.E(node))
                return;

            const target_class = `audio_row`;

            if (node.classList.contains('audio_row')) {
                mod.registry.add(node);
            } else {
                const elements = node.querySelectorAll(`.${target_class}`);
                if (elements.length > 0) {
                    mod.registry.add(elements);
                }
            }
        }

        const handleShuffleButton = node => {
            if (!kk.is.E(node))
                return;

            const target_class = `audio_page__shuffle_all`;

            if (node.classList.contains(target_class))
                node.classList.add(`kzvk`);
            else {
                const elements =
                    node.querySelectorAll(`.${target_class}`);

                if (elements.length > 0) {
                    elements.forEach(item =>
                        item.classList.add(`kzvk`)
                    );
                }
            }
        }
    }

    mod.on_loaded.dispatch();
}
