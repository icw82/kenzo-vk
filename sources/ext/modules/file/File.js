ext.File = class File {
    constructor(url) {
        this.on_change_url = new kk.Event();
        this.on_enrich = new kk.Event();

        this.on_change_url.addListener( this.getMeta.bind(this) );

        this.updateURL(url);

//        const _ = {
//            url: undefined,
//            clean_url: undefined,
//            name: undefined,
//            extension: undefined,
//
//            mime: undefined,
//            size: undefined,
//            modified: undefined,
//            expires: undefined,
//
//            progress: 0,
//            state: 0,
//            queue_id: undefined
//        };

//        [
//            'mime',
//            'size',
//            'modified',
//            'expires',
//            'queue_id',
//            'state'
//        ].forEach(key => this[key] = void 0);
//
//        this.progress = 0;
//        this.state = 0;

        const self = this;

        this.on_change_progress = new kk.Event();
        kk.watch(this, 'progress', this.on_change_progress);

        this.on_change_state = new kk.Event();
        kk.watch(this, 'state', this.on_change_state);

    }

    updateURL(new_value) {
        if (kk.is.s(new_value))
            new_value = new URL(new_value);

        if (!(new_value instanceof URL))
            throw TypeError();

        if (this.url && this.url.href === url.href)
            return;

        const prev_value = this.url;

        this.url = new_value;
        this.name = this.url.pathname.match(/\/(\w+?)\.\w+$/)[1];
        this.extension = this.url.pathname.match(/(\.\w+)$/)[1];
        this.on_change_url.dispatch(prev_value, new_value);

    }

    getMeta() {
        const self = this;
        const url = this.url.origin + this.url.pathname;

        browser.runtime.sendMessage({
            module: mod.name,
            method: 'get',
            arguments: url
        }, data => {
            for (let key in data) {
                if (key === 'basic') {
                    const basic = data[key];

                    ['size', 'mime', 'modified', 'expires'].forEach(key => {
                        self[key] = basic[key];
                    });

                } else {
                    self[key] = data[key];

                }
            }

            self.on_enrich.dispatch();
        });

    }

    startDownload(from) {
        mod.log('Start download:', this);

        const message = {
            module: 'downloads',
            action: 'start',
            args: {
                url: this.url.href,
            }
        }

        if (kk.is.s(from) && this[from] && this[from].name)
            message.args.name = this[from].name + this.extension;

        browser.runtime.sendMessage(message);
    }

    stopDownload() {
        mod.log('Stop download:', this);

        if (this.queue_id) {
            const message = {
                module: 'downloads',
                action: 'stop',
                args: {
                    id: this.queue_id
                }
            }

            browser.runtime.sendMessage(message);
        } else {
            mod.warn('Нет идентификатора');
        }
    }
}
