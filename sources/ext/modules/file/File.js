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

        [
            'progress',
            'state',
        ].forEach(key => {
            self[`on_change_${ key }`] = new kk.Event();

            kk.watch(this, key, () => {
                self['on_change_' + key].dispatch(this[key]);
            });
        });
    }

    updateURL(url) {
        if (kk.is_s(url))
            url = new URL(url);

        if (!(url instanceof URL))
            throw TypeError();

        if (this.url && this.url.href === url.href)
            return;

        this.url = url;
        this.name = this.url.pathname.match(/\/(\w+?)\.\w+$/)[1];
        this.extension = this.url.pathname.match(/(\.\w+)$/)[1];
        this.on_change_url.dispatch();

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
}
