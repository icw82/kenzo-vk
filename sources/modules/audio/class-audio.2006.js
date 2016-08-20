// Класс аудиоозаписи
// Экземпляр соответсвует каждому аудио-элементу на страницах ВК, то есть
// если на странице расположены абсолютно одинакоывае аудиозаписи, для них
// всё равно будет создан свой экземпляр

class Audio2006 {
    constructor (element) {
        const self = this;

        this.with_button = ext.options.audio__download_button;

        this.dom = {
            element: element
        }

        this.dom.element.classList.add('kzvk-audio');

        // Не встраивать кнопку в запись в узких колонках
        if (kk.find_ancestor(element, [
            '#profile_audios',
            '#public_audios'
        ])) {
            this.with_button = false;
        }

        // Получение информации о аудиозаписи со страницы VK
        let tw = this.dom.element.querySelector('.area .info .title_wrap');
        let id = this.dom.element.querySelector('a:first-child').getAttribute('name');
        let info = this.dom.element.querySelector('#audio_info' + id);
        // Чтобы небыло дублирования записей (в плеере)
        id = id.replace(/(.?)_pad$/, '$1');
        id = id.match(/(\d+?)_(\d+)/);

        if (!tw) {
            mod.error('ЧТО ЗА НАХУЙ', this.dom.element);
            mod.error('---', tw);
            return;
        }

        // FIX: Элемент может быть ещё не достроен
        let performer = tw.querySelector('b').textContent;
        let title = tw.querySelector('.title').textContent;

        let url = false;
        let duration = 0;

        if (info) {
            let matches = info.value.split(',');
            url = matches[0];
            duration = parseInt(matches[1]);
        }

        this.vk = {
            id: parseInt(id[1]),
            owner_id: parseInt(id[0]),
            get full_id() {
                return this.owner_id + '_' + this.id
            },
            performer: performer,
            title: title,
            get name() {return this.performer + ' '
                + mod.options.separator + ' '
                + this.title
            },
            duration: duration,
            // FIX: Никак не обрабатывается
            deleted: this.dom.element.querySelector('.area.deleted') ? true : false
        }

        // Чистка
        this.vk.performer = ext.filter.base(this.vk.performer);
        this.vk.performer = ext.filter.trash(this.vk.performer);

        this.vk.title = ext.filter.base(this.vk.title);
        this.vk.title = ext.filter.trash(this.vk.title);

        // Добавление или извлечение записи из реестра файлов;
        this.file = ext.modules.file.registry.add(url);

        this.file.name = this.vk.name;
        this.file.vk = this.vk;

        // Ширины строк
        if (!kk.find_ancestor(element, '.own_audios')) {
            this.dom.actions = this.dom.element.querySelectorAll('.actions > *:not(.unshown)');
            let quantity = 0

            if (this.dom.actions)
                quantity = this.dom.actions.length;

            this.dom.element.classList.add('kzvk-ac-' + quantity);
        }

        // Сокращение ширины индикатора длительности.
        if (this.vk.duration < 600) {
            // Меньше 10-ти минут
            this.dom.element.classList.add('kzvk-less-10');
        } else if (this.vk.duration < 3600) {
            // Меньше часа
            this.dom.element.classList.add('kzvk-less-60');
        } else if (this.vk.duration < 36000) {
            // Меньше 10 часов
            this.dom.element.classList.add('kzvk-less-600');
        }

        // Определение говновёрстки
        var table = this.dom.element.querySelector('table')
        if (table) {
            // Убожество на таблицах
            this.dom.type = 'tables';
            this.dom.element.classList.add('kzvk-tables');
            table.classList.add('kzvk-main');

        } else {
            // Убожество на дивах
            this.dom.type = 'divs';
            this.dom.element.classList.add('kzvk-divs');

        }

        // Определение оригинальный кнопки проигрывания
        this.dom.original_play_button = this.dom.element.querySelector('.play_new');

        // Замена родной кнопки Play
//        this.dom.play_button_wrap.firstChild.classList.add('kzvk-audio__original_play_button');
//        this.dom.play_button = document.createElement('div');
//        this.dom.play_button.innerHTML =
//            '<svg class="kzvk-audio__play_button">' +
//                '<use class="kzvk-audio__play" xlink:href="#kzvk-play-2006" />' +
//                '<use class="kzvk-audio__pause" xlink:href="#kzvk-pause-2006" />' +
//                '<use class="kzvk-audio__play-current" xlink:href="#kzvk-play-2006-current" />' +
//                '<use class="kzvk-audio__pause-current" xlink:href="#kzvk-pause-2006-current" />' +
//            '</svg>';
//
//        this.dom.play_button = this.dom.play_button.firstChild;
//        this.dom.play_button_wrap.appendChild(this.dom.play_button);

//            this.dom.element.insertBefore(
//                this.download_button.element,
//                this.dom.play_button_wrap
//            );

//        let observer = new MutationObserver(mutations => {
//            self.update();
//        });
//        observer.observe(this.dom.element, {childList: true, subtree: true});

        // Кнопка
        if (this.with_button) {
            this.dom.element.classList.add('with-button');
            this.download_button = new ext.DownloadButton(this.file, {
                mode: 'audio',
                module: mod.name
            });

            let wrapper = this.dom.original_play_button.parentElement;
            wrapper.appendChild(this.download_button.element);
        }

        if (this.deleted) {
            mod.log('Audio: — Запись удалена', this);
            return;
        }

        if (!this.file.available) {
//            mod.log('Audio: файл не доступен', this);
            return;
        }
    }
}

if (ext.mode === 2006)
    mod.Audio = Audio2006;
