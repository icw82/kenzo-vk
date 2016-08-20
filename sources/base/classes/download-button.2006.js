class DownloadButton2006 {
    constructor (file, props) {
        const self = this;

        this.file = file;

        if (props) {
            if (props.mode)
                this.mode = props.mode;

            if (props.module)
                this.module = props.module;
        }

        this.counter = 0;

        this.classes = [
            'kzvk-label',
            'kzvk-pending',
            'kzvk-progress',
            'kzvk-unavailable'
        ]

        this.carousel_classes = [
            'kzvk-download-button__carousel'
        ]

        if (ext.options.download_button__simplified)
            this.carousel_classes.push('kzvk-simplified-view');

        // Обёртка
        this.element = document.createElement('div');
        this.element.classList.add('kzvk-download-button');

        this.element.innerHTML =
            '<a class="' + this.carousel_classes.join(' ') + '">' +
                '<div class="kzvk-download-button__item kzvk-label"></div>' +
                '<div class="kzvk-download-button__item kzvk-pending">' +
                    '<svg class="kzvk-download-button__cross">' +
                        '<use xlink:href="#kzvk-cross" />' +
                    '</svg>' +
                '</div>' +
                '<div class="kzvk-download-button__item kzvk-progress">' +
                    '<div class="kzvk-download-button__progress-filling"></div>' +
                    '<svg class="kzvk-download-button__cross">' +
                        '<use xlink:href="#kzvk-cross" />' +
                    '</svg>' +
                '</div>' +
                '<div class="kzvk-download-button__item kzvk-unavailable"></div>' +
            '</a>';

        this.carousel = this.element.querySelector('.kzvk-download-button__carousel');
        this.carousel.setAttribute('draggable', true);

        this.label = this.element
            .querySelector('.kzvk-download-button__item.kzvk-label');
        this.progress = this.element
            .querySelector('.kzvk-download-button__item.kzvk-progress');
        this.progress__filling = this.element
            .querySelector('.kzvk-download-button__progress-filling');
        this.unavailable = this.element
            .querySelector('.kzvk-download-button__item.kzvk-unavailable');


        this.carousel.addEventListener('mousedown', function(event) {
            self.button_handler(event);
        }, false);

        this.carousel.addEventListener('dragstart', function(event) {
            self.button_handler(event);
        }, false);

        this.carousel.addEventListener('click', function(event) {
            self.button_handler(event);
        }, false);


        this.file.on_change_url.addListener(this.update.bind(this));
        this.file.on_enrich.addListener(this.update.bind(this));
//        this.file.on_error.addListener(this.update.bind(this));
        this.update();

        this.file.on_change_progress.addListener(function() {
            self.update_state();
        });

        this.file.on_change_state.addListener(function() {
            self.update_state();
        });

        this.update_state();
    }

    update() {
        const self = this;

        if (!this.file.available) {
            kk.class(self.element, 'kzvk-unavailable', this.classes);
            return;
        }

        let label = '…';
        let title = [];

        this.carousel.setAttribute('href', this.file.clean_url);
        this.carousel.setAttribute('download', this.file.name + this.file.extension);

        if (kk.is_n(this.file.size))
            title.push(ext.utils.format_filesize(this.file.size));

        if (this.mode === 'audio') {
            if (this.file.mime === 'audio/mpeg') {
//                title.push(ext.utils.format_filesize(this.file.MPEG.content_length));

                if (this.file.MPEG.method === 'CBR') {
                    label = this.file.MPEG.bitrate || '??';

                    // Прозрачность
                    if (label >= 288)
                        this.element.style.opacity = 1;
                    else if (label >= 224)
                        this.element.style.opacity = .85;
                    else if (label >= 176)
                        this.element.style.opacity = .7;
                    else if (label >= 112)
                        this.element.style.opacity = .55;
                    else
                        this.element.style.opacity = .4;

                } else {
                    label = 'VBR';
//                    title.push(this.file.MPEG.method.name);
//                    if (this.file.MPEG.method.quality !== false)
//                        this.element.style.opacity = 1 - this.file.MPEG.method.quality / 100 * .6;
                    this.element.style.opacity = .7;
                }
            }
        }


        if (title.length > 0)
            this.element.setAttribute('title', title.join(', '));

        this.label.setAttribute('data-label', label);
    }

    update_state() {
        const self = this;

        if (!this.file.available)
            return;

        if (self.file.state === 0) {
            kk.class(self.element, 'kzvk-label', self.classes);
            return;
        }

        if (self.file.state === 1) {
            kk.class(self.element, 'kzvk-pending', self.classes);
            return;
        }

        if (self.file.state === 2) {
            kk.class(self.element, 'kzvk-progress', self.classes);
            self.progress__filling.style.left = -100 + self.file.progress + '%';
//            self.element.progress.setAttribute('data-progress', item.progress + '%');
            return;
        }

        if (self.file.state === 3) {
            kk.class(self.element, 'kzvk-progress', self.classes);
            self.progress__filling.style.left = -100 + self.file.progress + '%';
            return;
        }
    }

    button_handler(event) {
        const self = this;

        // Прекращение распространения события
        event.stopPropagation();

        // TODO: Обрабатывать скачивания с помошью драг-н-дропа
        // FIX: Не различает файлы
        if (event.type === 'dragstart') {
            ext.log('event.type:', event.type);
            var data = event.dataTransfer;
            var url = 'audio/mpeg:' + this.file.vk_name  + '.mp3:' + this.file.url_clean;
            data.setData('DownloadURL', url);
//            data.addElement(this);
//            data.setDragImage();
            return;
        }

//        ext.log('event.type:', event.type);
//        ext.log('event.button:', event.button);
//            event.altKey
//            event.ctrlKey
//            event.metaKey
//            event.shiftKey

        //-1: Кнопка не нажата;
        //0: Основная кнопка, левая для правшей;
        //1: Вспомогательная кнопка, обычно колесо или средняя кнопка мыши;
        //2: Второстепенная кнопка мыши, правая для правшей;
        //3: 4-я кнопка, обычно Назад
        //4: 5-я кнопка, обычно Вперёд
        if (event.type === 'click') {
            event.preventDefault();

            if (event.button === 0) {
                if (self.file.available) {
                    if (self.file.state === 0)
                        start();
                    else
                        stop();
                } else
                    ext.log('Запись недоступна');

                return;
            }

            if (event.button === 1) {
                ext.log('DownloadButton:', self);
                return;
            }
        }

        function start() {
            let item = {
                url: self.file.clean_url,
                name: self.file.vk.name + self.file.extension,
                module: self.module
            };

//            console.log('* start() *', item);

            chrome.runtime.sendMessage({
                action: 'download',
                item: item
            });
        }

        function stop() {
            if (self.file.queue_id) {
                chrome.runtime.sendMessage({
                    action: 'cancel-download',
                    id: self.file.queue_id
                });
            } else {
                console.warn('Нет идентификатора')
            }
        }
    }
}

if (ext.mode === 2006)
    ext.DownloadButton = DownloadButton2006;
