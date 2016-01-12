// Класс аудиоозаписи

//    id — vk идентификатор;
//    vk_artist — vk исполнитель;
//    vk_title — vk название;
//    available — доступна ли аудиозапись;
//    url — url записи;
//    vk_duration — продолжительность записи.

mod.Audio = function(element) {
    this.available = false;

    this.dom = {
        element: element,
        tw: null
    }

    this.type = mod.get_audio_element_type(this.dom.element);

    if (!this.type) {
        mod.warn('mod.Audio — Тип элемента не определён', this);

    } else {
        this.id = this.dom.element.querySelector('a:first-child').getAttribute('name');

        this.dom.tw = this.dom.element.querySelector('.area .info .title_wrap');
        this.vk_artist = ext.name_filter(this.dom.tw.querySelector('b').textContent.trim());
        this.vk_title = ext.name_filter(this.dom.tw.querySelector('.title').textContent.trim());

        if (this.dom.element.querySelector('.area.deleted')) {
            mod.log('mod.Audio — Запись удалена', this);

        } else {
            this.dom.info = this.dom.element.querySelector('#audio_info' + this.id);

            if (this.dom.info) {
                let info = this.dom.info.value.split(',');
                this.url = info[0];
                this.vk_duration = parseInt(info[1]);
            }

            if (!this.url || this.url == '') {
                mod.log('mod.Audio — Отсутсвует URL', this);

            } else {
                // Чтобы небыло дублирования записей (в плеере)
                this.id = this.id.replace(/(.?)_pad$/, '$1');

                this.available = true;
            }
        }
    }

    Object.defineProperty(this, 'vk_name', {
        get: function() {
            if (
                (typeof this.vk_artist == 'string') &&
                (typeof this.vk_title == 'string')
            ) {
                return this.vk_artist + ' '
                    + mod.options.separator + ' '
                    + this.vk_title;
            }
        }
    });

    Object.defineProperty(this, 'url_clean', {
        get: function() {
            if (typeof this.url == 'string') {
                return this.url.replace(/^(.+?)\?.*/, '$1');
            }
        }
    });

    this.view = (function(self){
        var _ = {
            first_query: false,
            last_query: false
        }

        _.goal = function(object, property) {
            if (_.first_query === false) {
                _.first_query = setTimeout(_.update, 100);
                _.last_query = setTimeout(_.update, 10);
            } else {
                clearInterval(_.last_query);
                _.last_query = setTimeout(_.update, 10);
            }
        }

        _.update = function(){
            clearInterval(_.first_query);
            _.first_query = false;
            clearInterval(_.last_query);
            _.last_query = false;

            mod.update_button(self);
        }

        return _;
    })(this);

    mod.create_proxy(this, 'progress', mod.update_button__download_progress);

    mod.create_proxy(this.dom, 'wrapper', this.view.goal);
    mod.create_proxy(this.dom, 'carousel', this.view.goal);
    mod.create_proxy(this, 'vbr', this.view.goal);
    mod.create_proxy(this, 'bitrate', this.view.goal);
    mod.create_proxy(this, 'tag_version', this.view.goal);
    mod.create_proxy(this, 'error', this.view.goal);

}
