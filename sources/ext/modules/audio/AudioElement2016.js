const replaceClass = (container, target, new_class) => {
    const node = container.querySelector(`.${ target }`);
    if (node) {
        node.classList.remove(target);
        if (new_class)
            node.classList.add(new_class);
        return node;
    }
}

// Класс аудиозаписи
// Экземпляр соответсвует каждому аудио-элементу на страницах ВК, то есть
// если на странице расположены абсолютно одинакоывае аудиозаписи, для них
// всё равно будет создан свой экземпляр

class AudioElement2016 {
    constructor (node, mod) {

        const class_name = `kzvk-audio`;

        if (node.classList.contains(class_name)) {
            mod.warn(`Уже обработан, что странно`, node);
            return;
        }

//        if (node.status)
//            return;

        this.dom = {
            element: node
        }

        this.status = true;
//        node.status = true;

        // Информация об аудиозаписи из элемента аудиозаписи
        this.vk = AudioElement2016
            .get_data_from_vk_element(node, mod.options.separator);

        // Не встраивать кнопку, если элемент расположен в узких колонках
        this.with_button =
            mod.options.download_button &&
            !kk.find_ancestor(node, [
                `#profile_audios`,
                `#public_audios`
            ]);

        this.dom = {}

        // Основной элемент
        this.dom.element = node;
        this.dom.element.classList.add(class_name);
        this.dom.element.classList.remove('audio_has_thumb');
        this.dom.element.classList.remove('audio_row_with_cover');
        // Скрытие индикатора HQ
        if (mod.options.hide_hq_label)
            this.dom.element.classList.remove('audio_hq');

        if (this.with_button) {
            this.dom.element.classList.add('with-button');
        }

        // Элемент с названием, временем и кнопками действия
        this.dom.content =
            this.dom.element.querySelector(`.audio_row_content`);
        this.dom.title_cell =
            this.dom.element.querySelector(`.audio_row__inner`);
            // `${ class_name }__title_cell`
//        this.dom.lyrics =
//            this.dom.element.querySelector('.audio_row__lyrics');


        // *************************
        // Удаление лишних элементов
        {
            const container = kk.find_ancestor(node, `.audio_w_covers`);
            container && container.classList.remove(`audio_w_covers`);

            node.querySelectorAll([
                `.blind_label`,
                `.audio_row__cover`,
                `.audio_row__cover_back`,
                `.audio_row__cover_icon`,
                `.audio_row__counter`,
                `.audio_row__play_btn`
            ].join(`,`)).forEach(node => node.remove());
        }


//        if (!this.dom.content || !this.dom.title_cell) {
//            console.warn('Элемент не найден');
//            return;
//        }
//
//        // В КК
//        const makeElement = (class_name, tag = 'div') => {
//            const element = document.createElement(tag);
//            element.classList.add(`${ class_name }__${ class_name }`);
//            return element;
//        }
//
//        // Разметка (сетка) элемента аудиозаписи
//        this.dom.play_button_cell = makeElement(`play_button_cell`);
//        this.dom.download_button_cell = makeElement(`download_button_cell`);
//
//        this.dom.content.insertBefore(
//            this.dom.download_button_cell,
//            this.dom.content.firstChild
//        );
//
//        this.dom.content.insertBefore(
//            this.dom.play_button_cell,
//            this.dom.download_button_cell
//        );
//
//        // Наполнение сетки
//        this.dom.play_button = document.createElement('div');
//        this.dom.play_button.innerHTML =
//            '<svg class="kzvk-audio__play_button">' +
//                '<use class="kzvk-audio__play" x="50%" y="50%" ' +
//                    'xlink:href="#kzvk-play-classic" />' +
//                '<use class="kzvk-audio__pause" x="50%" y="50%" ' +
//                    'xlink:href="#kzvk-pause-classic" />' +
//            '</svg>';
//
//        this.dom.play_button = this.dom.play_button.firstChild;
//        this.dom.play_button_cell.appendChild(this.dom.play_button);
//
//
        mod.submodules.host_service.getAudioURL(
            this.vk.full_id,
            this.vk.id_for_request
        ).then(url => {

            // Добавление или извлечение записи из реестра файлов;
            this.file = ext.modules.file.registry.add(url);

            this.file.name = this.vk.name;
            this.file.vk = this.vk;

            // Кнопка
            if (this.with_button) {
                this.download_button = new ext.DownloadButton(this.file, {
                    mode: 'audio',
                    module: mod.name
                });

                this.dom.download_button_cell.appendChild(
                    this.download_button.element
                );
            }

            if (this.deleted) {
                mod.log('Audio: — Запись удалена', this);
                return;
            }

        }, error => {
            // Файл-болванка
            this.file = ext.modules.file.registry.add(null);

            // Кнопка-болванка
            if (this.with_button) {
                this.download_button = new ext.DownloadButton(this.file, {
                    mode: 'audio',
                    module: mod.name
                });

                this.dom.download_button_cell.appendChild(
                    this.download_button.element
                );
            }
        });

//        this.dom.element.classList.add('kzvk-audio');
//
//        // Удаление оригинальныйх классов
////        [
////            [
////                'audio_row__performer_title',
////                `${ class_name }__title-container`
////            ], [
////                'audio_row__performers',
////                `${ class_name }__performers`
////            ], [
////                'audio_row__title',
////                `${ class_name }__title`
////            ], [
////                'audio_row__title_inner',
////                `${ class_name }__title-inner`
////            ], [
////                'audio_row__title_inner_subtitle',
////                `${ class_name }__subtitle`
////            ]
////        ].forEach(item => {
////            replaceClass(this.dom.title_cell, item[0], item[1])
////        });
//
////        this.dom.element.classList.remove('audio_row');
////        this.dom.element.classList.remove('_audio_row');
//
//        // Исправление бага с высотой элемента при открытии
//        // и закрытии сопроводительного текста
//        {
//            const observer = new MutationObserver(mutations => {
//                mutations.forEach(mutation => {
//                    if (
//                        mutation.attributeName === 'style' &&
//                        this.dom.element.style.height
//                    ) {
//                        this.dom.element.style.height = null;
//                    }
//                });
//            });
//            observer.observe(this.dom.element, {attributes: true});
//        }

    }

    static get_data_from_vk_element(node, separator) {
        const source = JSON.parse(node.getAttribute(`data-audio`));

        const getHashes = string => {
            const parts = string.split(`/`);
            const hashes = {};

            [
                `addHash`,
                `editHash`,
                `actionHash`,
                `deleteHash`,
                `replaceHash`,
                `urlHash`,
            ].forEach( (name, index) => hashes[name] = parts[index] );

            return hashes;
        }

        const vk = {
            // _source: source,
            id: source[0],
            owner_id: source[1],
            get full_id() {
                return `${ this.owner_id }_${this.id}`;
            },
            get id_for_request() {
                return [
                    this.full_id,
                    this.hashes.actionHash,
                    this.hashes.urlHash,
                ].join(`_`);
            },
            performer: source[4].replace(/(<\/?em>)/g, ``),
            title: source[3].replace(/(<\/?em>)/g, ``),
            get name() {
                return `${ this.performer } ${ separator } ${ this.title }`
            },
            duration: source[5],
            hashes: getHashes(source[13]),
            // deleted: hashes[3] ? true : false
        }

        // Чистка
        vk.performer = core.utils.filter.base(vk.performer);
        vk.performer = core.utils.filter.trash(vk.performer);

        vk.title = core.utils.filter.base(vk.title);
        vk.title = core.utils.filter.trash(vk.title);

        return vk;
    }

    get is_element_exist() {
        return document.body.contains(this.dom.element);
    }
}

if (ext.mode === 2016) {
    mod.AudioElement = AudioElement2016;
}
