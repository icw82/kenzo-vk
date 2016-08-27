class File {
    constructor(url) {
        const self = this;

        const _ = {
            url: undefined,
            clean_url: undefined,
            name: undefined,
            extension: undefined,

            mime: undefined,
            size: undefined,
            modified: undefined,
            expires: undefined,

            progress: 0,
            state: 0,
            queue_id: undefined
        };

        // События
        this.on_error = new kk.Event();

        this.on_change_url = new kk.Event();

        this.on_enrich = new kk.Event();

        // Получение информации
        this.on_change_url.addListener(function() {
            if (self.available) {
                self.get_meta(_);
            }
        });

        // Свойства
        Object.defineProperty(this, 'clean_url', {
            get: () => {return _.clean_url}
        });

        Object.defineProperty(this, 'mime', {
            get: () => {return _.mime}
        });

        Object.defineProperty(this, 'size', {
            get: () => {return _.size}
        });

        Object.defineProperty(this, 'modified', {
            get: () => {return _.modified}
        });

        Object.defineProperty(this, 'queue_id', {
            get: () => {return _.queue_id},
            set: function(new_value) {
                _.queue_id = new_value;
            }
        });

        Object.defineProperty(this, 'url', {
            get: () => {return _.url},
            set: value => {
//                if (value === null) {
//                    _.url = null;
//                    _.clean_url = null;
//                } else
                if (kk.is_s(value) && value !== '') {
                    _.url = value;
                    _.clean_url = this.url.replace(/^(.+?)\?.*/, '$1');

                    let matches = _.url.match(/^.+?([^\/]+?)(\.\w+)(?:$|\?.*)/);

                    if (!_.name)
                        _.name = matches[1];
                    if (!_.extension)
                        _.extension = matches[2];

                } else {
                    _.url = undefined;
                    _.clean_url = undefined;
                }

                self.on_change_url.dispatch();
            }
        });

        this.url = url;

        function create_proxy_with_event_dispatch(key) {
            self['on_change_' + key] = new kk.Event();

            Object.defineProperty(self, key, {
                get: () => {return _[key]},
                set: function(new_value) {
                    if (_[key] !== new_value) {
                        _[key] = new_value;
                        self['on_change_' + key].dispatch();
                    }
                }
            });
        }

        each (['progress', 'state', 'name', 'extension'],
            create_proxy_with_event_dispatch);
    }

    get available() {
        if (typeof this.url !== 'string')
            return false;

        return true;
    }

    get_meta(_) {
        if (!this.available)
            return;

        const self = this;

        chrome.runtime.sendMessage({
            module: 'file',
            method: 'get',
            arguments: [self.clean_url]
        }, data => {


            for (let key in data) {
                if (key === 'basic') {
                    each (['size', 'mime', 'modified', 'expires'], key =>{
                        _[key] = data.basic[key];
                    });

                } else {
                    self[key] = data[key];

                }
            }

            self.on_enrich.dispatch();
        });
    }
}

ext.File = File;
