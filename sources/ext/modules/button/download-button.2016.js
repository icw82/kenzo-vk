class DownloadButton2016 {
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
        ];

//        this.container_classes = [
//            'kzvk-download-button__container'
//        ]
//
//        if (simplified)
//            this.container_classes.push('kzvk-simplified-view');

        // Обёртка
        this.element = document.createElement('div');
        this.element.classList.add('kzvk-download-button');

        // Контейнер
        this.container = document.createElement('a');
        this.container.classList.add('kzvk-download-button__container');
//        this.container.setAttribute('draggable', true);
        this.element.appendChild(this.container);

        // Этикетка
        {
            let label = document.createElement('span');
            label.classList.add('kzvk-download-button__item');
            label.classList.add('kzvk-label');

            label.innerHTML = '<svg>' +
                '<text x="50%" y="50%" text-anchor="middle"></text>' +
                '<g class="kzvk-arrow" width="10px">' +
                    '<rect class="kzvk-overlay" width="7px" height="6px" />' +
                    '<rect class="kzvk-shaft" width="1px" height="6px" />' +
                    '<use class="kzvk-head" xlink:href="#kzvk-download-arrow-2016" />' +
                '</g>' +
            '</svg>';

            this.label = label.querySelector('text');
            this.container.appendChild(label);
        }

        // Ожидание
        {
            let pending = document.createElement('span');
            pending.classList.add('kzvk-download-button__item');
            pending.classList.add('kzvk-pending');

            pending.innerHTML =
                '<svg>' +
                    '<use class="kzvk-arrow" xlink:href="#kzvk-pending-2016" />' +
                    '<use class="kzvk-cross" xlink:href="#kzvk-cross-2016" />' +
                '</svg>';

            this.container.appendChild(pending);
        }

        // Индикатор прогресса
        {
            let progress = document.createElement('span');
            progress.classList.add('kzvk-download-button__item');
            progress.classList.add('kzvk-progress');

            progress.innerHTML =
                '<svg>' +
                    '<rect class="kzvk-filling" width="100%" height="100%" />' +
                    '<use class="kzvk-cross" xlink:href="#kzvk-cross-2016" />' +
                '</svg>';;

            this.progress__filling = progress.querySelector('.kzvk-filling');
            this.container.appendChild(progress);
        }

        // Недоступно
        {
            let unavailable = document.createElement('span');
            unavailable.classList.add('kzvk-download-button__item');
            unavailable.classList.add('kzvk-unavailable');

            unavailable.innerHTML =
                '<svg>' +
                    '<text x="50%" y="50%" text-anchor="middle"></text>' +
                '</svg>';

            this.unavailable = unavailable.querySelector('text');
            this.container.appendChild(unavailable);

        }

        this.container.addEventListener('mousedown', event => {
            self.button_handler(event);
        });

        this.container.addEventListener('dragstart', event => {
            self.button_handler(event);
        });

        this.container.addEventListener('click', event => {
            self.button_handler(event);
        });


        this.file.on_change_url.addListener(this.update.bind(this));
        this.file.on_enrich.addListener(this.update.bind(this));
//        this.file.on_error.addListener(this.update.bind(this));
        this.update();

        this.file.on_change_progress.addListener(() => {
            self.update_state();
        });

        this.file.on_change_state.addListener(() => {
            self.update_state();
        });
    }

    update() {
        const self = this;

        let opacity = .4;

        if (!this.file.available && this.file.url !== null) {
            this.element.style.opacity = opacity;
            this.unavailable.innerHTML = '×_×';
            kk.class(self.element, 'kzvk-unavailable', this.classes);

//            console.log(this.file.url);
            return;
        }

        let label = '…';
        let title = [];

        if (this.file.url !== null) {
            this.container.setAttribute('href', this.file.clean_url);
            this.container.setAttribute('download', this.file.name + this.file.extension);

            if (kk.is_n(this.file.size))
                title.push(core.utils.format_filesize(this.file.size));

            if (this.mode === 'audio') {
                if (this.file.mime === 'audio/mpeg') {
    //                title.push(core.utils.format_filesize(this.file.MPEG.content_length));

                    if (this.file.MPEG.method === 'CBR') {
                        label = this.file.MPEG.bitrate || '??';

                        // Прозрачность
                        if (label >= 288)
                            opacity = 1;
                        else if (label >= 224)
                            opacity = .85;
                        else if (label >= 176)
                            opacity = .7;
                        else if (label >= 112)
                            opacity = .55;

                    } else {
                        label = 'VBR';
//                        title.push(this.file.MPEG.method.name);
//                        if (this.file.MPEG.method.quality !== false)
//                            this.element.style.opacity =
//                                1 - this.file.MPEG.method.quality / 100 * .6;
                        opacity = .7;
                    }
                }
            }

            if (title.length > 0)
                this.element.setAttribute('title', title.join(', '));
        }

        this.element.style.opacity = opacity;
        this.label.innerHTML = label;
        this.update_state();
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
//            console.log('self.file.progress', self.file.progress);
            kk.class(self.element, 'kzvk-progress', self.classes);
            self.progress__filling.style.transform =
                'translateX(' + (-100 + self.file.progress) + '%)';
            return;
        }

        if (self.file.state === 3) {
            kk.class(self.element, 'kzvk-progress', self.classes);
            self.progress__filling.style.transform =
                'translateX(' + (-100 + self.file.progress) + '%)';
            return;
        }
    }

    button_handler(event) {
        const self = this;

        // Прекращение распространения события
        event.stopPropagation();

//        // Игнорирование остальных слушателей
//        event.stopImmediatePropagation()

        // TODO: Обрабатывать скачивания с помошью драг-н-дропа
        // FIXME: Не различает файлы
        if (event.type === 'dragstart') {
//            ext.log('event.dataTransfer:', event.dataTransfer);
//
//            const data = event.dataTransfer;
//            const url = 'audio/mpeg:' + this.file.vk_name  + '.mp3:' + this.file.url_clean;
//            data.setData('DownloadURL', url);
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

        if (event.type === 'mousedown') {
            event.preventDefault();

        }

        if (event.type === 'click') {
            event.preventDefault();

            if (event.button === 0) {
                if (self.file.available) {
                    if (event.ctrlKey || event.altKey) {
                        ext.info(self);
                    } else {
                        if (self.file.state === 0)
                            start();
                        else
                            stop();
                    }
                } else
                    ext.log('Запись недоступна');

                return;
            }

        }

        function start() {
            let item = {
                url: self.file.clean_url,
                name: self.file.vk.name + self.file.extension,
                module: self.module
            };

            ext.info('Start download:', item);

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

if (ext.mode === 2016)
    ext.DownloadButton = DownloadButton2016;
