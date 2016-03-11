// Класс аудиоозаписи

//    id — vk идентификатор;
//    vk_artist — vk исполнитель;
//    vk_title — vk название;
//    available — доступна ли аудиозапись;
//    url — url записи;
//    vk_duration — продолжительность записи.

class Audio {
    constructor(element) {
        this.available = false;

        this.dom = {
            element: element,
            tw: null
        }

        mod.create_proxy(this, 'progress', mod.update_button__download_progress);

        let listener = new ext.ModelListener(mod.update_button, this);
        let goal = listener.goal.bind(listener);

        each ([
            [this.dom, 'wrapper'],
            [this.dom, 'carousel'],
            [this, 'vbr'],
            [this, 'bitrate'],
            [this, 'tag_version'],
            [this, 'error'],
        ], function(item) {
            mod.create_proxy(item[0], item[1], goal);
        });

        this.type = mod.get_audio_element_type(this.dom.element);

        if (!this.type) return;

        this.dom.tw = this.dom.element.querySelector('.area .info .title_wrap');
        this.id = this.dom.element.querySelector('a:first-child').getAttribute('name');
        this.vk_artist = ext.name_filter(this.dom.tw.querySelector('b').textContent.trim());
        this.vk_title = ext.name_filter(this.dom.tw.querySelector('.title').textContent.trim());

        if (this.dom.element.querySelector('.area.deleted')) {
            mod.log('Audio: — Запись удалена', this);
            return;
        }

        this.dom.info = this.dom.element.querySelector('#audio_info' + this.id);

        if (this.dom.info) {
            let info = this.dom.info.value.split(',');
            this.url = info[0];
            this.vk_duration = parseInt(info[1]);
        }

        if (!this.url || this.url == '') {
            mod.log('Audio: Отсутсвует URL', this);
            return;

        }

        // Чтобы небыло дублирования записей (в плеере)
        this.id = this.id.replace(/(.?)_pad$/, '$1');
        this.available = true;

    }

    get vk_name() {
        if (
            (typeof this.vk_artist == 'string') &&
            (typeof this.vk_title == 'string')
        ) {
            return this.vk_artist + ' '
                + mod.options.separator + ' '
                + this.vk_title;
        }
    }

    get url_clean() {
        if (typeof this.url == 'string') {
            return this.url.replace(/^(.+?)\?.*/, '$1');
        }
    }

    enrich() {
        if (!this.available) return;
        var self = this;

        chrome.runtime.sendMessage({
            method: 'get_audio_info',
            arguments: [this.id, this.url_clean]
        }, function(response) {
            self.size = response.size;
            self.tag_version = response.tag_version;
            self.tag_length = response.tag_length;

            self.bitrate__classic = Audio.calc_bitrate_classic(self.size, self.vk_duration);
            self.bitrate__average = Math.floor(self.size * 8 / self.vk_duration / 1000);

            if (response.bitrate)
                self.bitrate = response.bitrate;
            else if (self.size) {
                if (
                    self.tag_version == 'ID3v2.2' ||
                    self.tag_version == 'ID3v2.3' ||
                    self.tag_version == 'ID3v2.4'
                ) {
                    self.bitrate = Audio.calc_bitrate_classic(
                        self.size - self.tag_length - 10,                                self.vk_duration
                    );
                } else
                    self.bitrate = self.bitrate__classic;
            }

            if (typeof response.vbr == 'string')
                self.vbr = response.vbr;
        });
    }

    static calc_bitrate_classic(size, duration) {
        var kbps = Math.floor(size * 8 / duration / 1000);

        if ((kbps >= 288)) kbps = 320; else
        if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
        if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
        if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
        if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
        if ((kbps >= 80 ) && (kbps < 112)) kbps = 96; else
        if ((kbps >= 48 ) && (kbps < 80 )) kbps = 64; else
        if ((kbps >= 20 ) && (kbps < 48 )) kbps = 32;

        return kbps;
    }
}

mod.Audio = Audio;
