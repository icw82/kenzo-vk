// Класс аудиоозаписи
// Экземпляр соответсвует каждому аудио-элементу на страницах ВК, то есть
// если на странице расположены абсолютно одинакоывае аудиозаписи, для них
// всё равно будет создан свой экземпляр

class Audio2016 {
    constructor (element) {
        const self = this;

        this.dom = {
            element: element
        }

        this.dom.element.classList.add('kzvk-audio');

        // Получение информации об аудиозаписи со страницы VK
        const info = JSON.parse(this.dom.element.getAttribute('data-audio'));
        let url = false;

        const clean = string => string.replace(/(<\/?em>)/g, '');

        this.vk = {
            id: info[0],
            owner_id: info[1],
            get full_id() {
                return this.owner_id + '_' + this.id
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

        // Обёртка для кнопок
        this.dom.original_play_button =
            this.dom.element.querySelector('.audio_row_cover_wrap');
        this.dom.button_wrapper = document.createElement('div');
        this.dom.button_wrapper.classList.add('kzvk-audio__button-wrapper');

        this.dom.original_play_button.parentElement.insertBefore(
            this.dom.button_wrapper,
            this.dom.original_play_button.nextSibling
        );

        // Замена мэйлрушного говна (обложки с ебучей нотой)
        this.dom.original_play_button.classList
            .add('kzvk-audio__original_play_button');

        this.dom.play_button = document.createElement('div');
        this.dom.play_button.innerHTML =
            '<svg class="kzvk-audio__play_button">' +
                '<use class="kzvk-audio__play" xlink:href="#kzvk-play-classic" />' +
                '<use class="kzvk-audio__pause" xlink:href="#kzvk-pause-classic" />' +
            '</svg>';

        this.dom.play_button = this.dom.play_button.firstChild;
        this.dom.button_wrapper.appendChild(this.dom.play_button);


        this.with_button = mod.options.download_button;
        // Не встраивать кнопку в запись в узких колонках
        if (kk.find_ancestor(element, [
            '#profile_audios',
            '#public_audios'
        ])) {
            this.with_button = false;
        }

        if (mod.options.hide_hq_label) {
            this.dom.element.classList.add('without-hq-label');
        }

        if (this.with_button) {
            this.dom.element.classList.add('with-button');
        }

        mod.vk.get_url(this.vk.full_id).then(url => {
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

                this.dom.button_wrapper.appendChild(
                    this.download_button.element);
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

                this.dom.button_wrapper.appendChild(this.download_button.element);
            }
        });

//        let observer = new MutationObserver(mutations => {
//            self.update();
//        });
//        observer.observe(this.dom.element, {childList: true, subtree: true});

    }
}

if (ext.mode === 2016)
    mod.Audio = Audio2016;
