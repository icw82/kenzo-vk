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

class Audio2016 {
    constructor (element) {
        const self = this;
        const prefix = `kzvk-audio`;

        this.dom = {
            element: element
        }

        if (element.executed)
            return;

        element.executed = true;

        // Получение информации об аудиозаписи со страницы VK
        const info = JSON.parse(this.dom.element.getAttribute('data-audio'));
        let url = false;

        const clean = string => string.replace(/(<\/?em>)/g, '');

        this.vk = {
            id: info[0],
            owner_id: info[1],
            hashes: info[13],
            get full_id() {
                let hashes = this.hashes.split(`/`);
                return this.owner_id + '_' + this.id + '_' + hashes[2] + '_' + hashes[5]
            },
            performer: clean(info[4]),
            title: clean(info[3]),
            get name() {return this.performer + ' '
                + mod.options.separator + ' '
                + this.title
            },
            duration: info[5],
            deleted: element.dataset.deleteHash ? true : false
        }

        // Чистка
        this.vk.performer = core.utils.filter.base(this.vk.performer);
        this.vk.performer = core.utils.filter.trash(this.vk.performer);

        this.vk.title = core.utils.filter.base(this.vk.title);
        this.vk.title = core.utils.filter.trash(this.vk.title);

        // DOM

        // Удаление лишних элементов
        {
            const to_remove = this.dom.element.querySelectorAll([
                '.blind_label',
                '.audio_row__cover',
                '.audio_row__cover_back',
                '.audio_row__cover_icon',
                '.audio_row__counter',
                '.audio_row__play_btn'
            ].join(','));

            each (to_remove, node => node.remove());
        }

        this.dom.element.classList.remove('audio_row_with_cover');

        // Скрытие индикатора HQ
        if (mod.options.hide_hq_label) {
            this.dom.element.classList.remove('audio_hq');
        }

        this.with_button = mod.options.download_button;
        // Не встраивать кнопку в запись в узких колонках
        if (kk.find_ancestor(element, [
            '#profile_audios',
            '#public_audios'
        ])) {
            this.with_button = false;
        }

        if (this.with_button) {
            this.dom.element.classList.add('with-button');
        }

        // Элемент с названием, временем и кнопками действия
        this.dom.content =
            this.dom.element.querySelector('.audio_row_content');

//        this.dom.title_cell =
//            this.dom.element.querySelector('.audio_row__inner');
        this.dom.title_cell = replaceClass(
            this.dom.element,
            `audio_row__inner`,
            `${ prefix }__title_cell`
        );

//        this.dom.lyrics =
//            this.dom.element.querySelector('.audio_row__lyrics');

        if (!this.dom.content || !this.dom.title_cell) {
            console.warn('Элемент не найден');
            return;
        }

        // В КК
        const makeElement = (class_name, tag = 'div') => {
            const element = document.createElement(tag);
            element.classList.add(`${ prefix }__${ class_name }`);
            return element;
        }

        // Разметка (сетка) элемента аудиозаписи
        this.dom.play_button_cell = makeElement(`play_button_cell`);
        this.dom.download_button_cell = makeElement(`download_button_cell`);

        this.dom.content.insertBefore(
            this.dom.download_button_cell,
            this.dom.content.firstChild
        );

        this.dom.content.insertBefore(
            this.dom.play_button_cell,
            this.dom.download_button_cell
        );

        // Наполнение сетки
        this.dom.play_button = document.createElement('div');
        this.dom.play_button.innerHTML =
            '<svg class="kzvk-audio__play_button">' +
                '<use class="kzvk-audio__play" x="50%" y="50%" ' +
                    'xlink:href="#kzvk-play-classic" />' +
                '<use class="kzvk-audio__pause" x="50%" y="50%" ' +
                    'xlink:href="#kzvk-pause-classic" />' +
            '</svg>';

        this.dom.play_button = this.dom.play_button.firstChild;
        this.dom.play_button_cell.appendChild(this.dom.play_button);


        mod.submodules.host_service.get_url(this.vk.full_id).then(url => {

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

        this.dom.element.classList.add('kzvk-audio');

        // Удаление оригинальныйх классов
        [
            [
                'audio_row__performer_title',
                `${ prefix }__title-container`
            ], [
                'audio_row__performers',
                `${ prefix }__performers`
            ], [
                'audio_row__title',
                `${ prefix }__title`
            ], [
                'audio_row__title_inner',
                `${ prefix }__title-inner`
            ], [
                'audio_row__title_inner_subtitle',
                `${ prefix }__subtitle`
            ]
        ].forEach(item => {
            replaceClass(this.dom.title_cell, item[0], item[1])
        });

//        this.dom.element.classList.remove('audio_row');
//        this.dom.element.classList.remove('_audio_row');

        // Исправление бага с высотой элемента при открытии
        // и закрытии сопроводительного текста
        {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (
                        mutation.attributeName === 'style' &&
                        this.dom.element.style.height
                    ) {
                        this.dom.element.style.height = null;
                    }
                });
            });
            observer.observe(this.dom.element, {attributes: true});
        }

    }
}

if (ext.mode === 2016)
    mod.Audio = Audio2016;
