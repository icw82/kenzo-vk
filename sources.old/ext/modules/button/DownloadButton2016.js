class DownloadButton2016 {

    applyStateClass(name) {
        const { CLASSES, element } = this;
        kk.class(element, name, Object.values(CLASSES.STATE))
    }

    applyQualityClass(quality) {
        const { CLASSES, element, prefix } = this;
        kk.class(
            element,
            `${ prefix }-quality-${ quality }`,
            CLASSES.QUALITY //Object.values(CLASSES.QUALITY)
        );
    }

    constructor (file, props) {
        if (!(file instanceof ext.File))
            throw new TypeError(file);

        const prefix = 'kzvk';
        this.prefix = prefix;

        const CLASSES = {
            STATE: [
                'label',
                'pending',
                'progress',
                'unavailable'
            ].reduce(
                (_, key) => {
                    _[key.toUpperCase()] = `${ prefix }-${ key }`
                    return _;
                },
                {}
            ),

            QUALITY: [
                1, 2, 3, 4, 5, 'vbr'
            ].map(key => `${ prefix }-quality-${ key }`)
        }

        Object.defineProperty(this, 'CLASSES', { get: () => CLASSES });

        if (props) {
            if (props.mode)
                this.mode = props.mode;

            if (props.module)
                this.module = props.module;
        }

        this.counter = 0;

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

        // TODO: Вынести шаблон в отдельный файл
        // Этикетка
        {
            let label = document.createElement('span');
            label.classList.add('kzvk-download-button__item');
            label.classList.add('kzvk-label');

            label.innerHTML = '<svg>' +
                '<text x="50%" y="50%" text-anchor="middle"></text>' +
                '<g class="kzvk-arrow">' +
                    '<rect class="kzvk-overlay" x="50%" width="7px" height="6px" />' +
                    '<use class="kzvk-head" x="50%" xlink:href="#kzvk-download-arrow" />' +
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
                    '<use class="kzvk-arrow" x="50%" y="50%" xlink:href="#kzvk-pending-2016" />' +
                    '<use class="kzvk-cross" x="50%" y="50%" xlink:href="#kzvk-cross-2016" />' +
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
                    '<use class="kzvk-cross" x="50%" y="50%" xlink:href="#kzvk-cross-2016" />' +
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

        const self = this;

        this.container.addEventListener('mousedown', event => {
            self.button_handler(event);
        });

        this.container.addEventListener('dragstart', event => {
            self.button_handler(event);
        });

        this.container.addEventListener('click', event => {
            self.button_handler(event);
        });

        this.bindFile(file);

    }

    bindFile(file) {
        if (this.file instanceof ext.File) {
            mod.warn('Файл уже привязанк к кнопке');
            return;
        }

        const main_handler = () => this.update();
        const state_handler = (prev, next) =>
            this.updateState(`state_handler`);

        this.file = file;

        this.file.on_change_url.addListener(main_handler);
        this.file.on_enrich.addListener(main_handler);
//        this.file.on_error.addListener(main_handler);

        this.update('bindFile'); // Почему именно здесь?

        this.file.on_change_progress.addListener(state_handler);
        this.file.on_change_state.addListener(state_handler);
    }

    update(source) {
//        console.log('U P D A T E', source);

        const self = this;

        let quality = 5; // index

        if (!this.file.url) {
//            this.element.style.opacity = opacity;
            this.unavailable.textContent = '×_×';
            this.applyStateClass(this.CLASSES.STATE.UNAVAILABLE);

//            console.log(this.file.url);
            return;
        }

        let label = '…';
        let title = [];

        if (this.file.url !== null) {
            this.container.setAttribute(
                'href',
                this.file.url.href
            );
            this.container.setAttribute(
                'download',
                this.file.name + this.file.extension
            );

            if (kk.is.n(this.file.size))
                title.push(core.utils.format_filesize(this.file.size));

            if (this.mode === 'audio') {
                if (this.file.mime === 'audio/mpeg') {
    //                title.push(core.utils.format_filesize(this.file.MPEG.content_length));

                    if (this.file.MPEG.method === 'CBR') {
                        label = this.file.MPEG.bitrate || '??';

                        // Прозрачность
                        if (label >= 288)
                            quality = 1;
                        else if (label >= 224)
                            quality = 2;
                        else if (label >= 176)
                            quality = 3;
                        else if (label >= 112)
                            quality = 4;

                    } else {
                        label = 'VBR';
//                        title.push(this.file.MPEG.method.name);
//                        if (this.file.MPEG.method.quality !== false)
//                            element.style.opacity =
//                                1 - this.file.MPEG.method.quality / 100 * .6;
                        quality = 'vbr';
                    }
                }
            }

            if (title.length > 0)
                this.element.setAttribute('title', title.join(', '));
        }

        this.applyQualityClass(quality);

//        this.element.style.opacity = opacity;
        this.label.textContent = label;
        this.updateState('update');
    }


    updateState(source) {
//        console.log(`U P D A T E   S T A T E`, source);

        switch (this.file.state) {
            case 0:
                this.applyStateClass(this.CLASSES.STATE.LABEL);
                break;

            case 1:
                this.applyStateClass(this.CLASSES.STATE.PENDING);
                break;

            case 2:
                this.applyStateClass(this.CLASSES.STATE.PROGRESS);
                this.progress__filling.style.transform =
                    'translateX(' + (-100 + this.file.progress) + '%)';
                break;

            case 3:
                this.applyStateClass(this.CLASSES.STATE.PROGRESS);
                this.progress__filling.style.transform =
                    'translateX(' + (-100 + this.file.progress) + '%)';
                break;
        }
    }

    button_handler(event) {
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
                if (this.file.url) {
                    if (event.ctrlKey || event.altKey) {
                        ext.log(this);
                    } else {
                        if (this.file.state === 0)
                            this.file.startDownload('vk');
                        else
                            this.file.stopDownload();
                    }
                } else
                    ext.log('Запись недоступна');

                return;
            }

        }
    }
}

if (ext.mode === 2016)
    ext.DownloadButton = DownloadButton2016;
