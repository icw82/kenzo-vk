class RequestItem {
    constructor(id) {
        this.id = id;
        this.request = undefined;
        this.response = undefined;
        this.on_response = new kk.Event();

//        this.on_response = new kk.Event();
    }

    setResponse(data) {
        if (this.response)
            throw Error(`Ответ уже получен`);

        this.response = data;
        this.on_response.complete(this.response);
    }

    async getResponse() {
        const self = this;

        if (this.response)
            return await this.response;
        else
            return await new Promise((resolve, reject) => {
                const listener = response => {
                    resolve(response);
                    self.on_response.removeListener(listener);
                }

                self.on_response.addListener(listener);
            });
    }
}

class Request {
    constructor(items) {
        this.items = items;
        this.ts = Date.now(); // requests_counter

        this.items.forEach(item => item.request = this);

        this.query = {
            act: `reload_audio`,
            al: 1,
            ids: this.items.map(item => item.id).join(`,`)
        }

        this.encoded_query = [];

        for (let key in this.query) {
            this.encoded_query.push(
                `${ key }=${ encodeURIComponent(this.query[key]) }`
            );
        }
        this.encoded_query = this.encoded_query.join(`&`);

        this.request = {
            url: `https://vk.com/al_audio.php`,
            method: `POST`,
            headers: {
                'Content-Type': `application/x-www-form-urlencoded`,
                'X-Requested-With': `XMLHttpRequest`
            },
            query: this.encoded_query
        }

//        if (request.items.length > 0) {
//            pending.push(request);
//            send(request);
//        }
    }

    has(item) {
        if (item instanceof RequestItem) {
            return this.items.find(li => li.id === item.id);
        } else {
            return this.items.find(li => li.id === item);
        }
    }

    async send() {
        let response = await mod.ext.modules
            .provider.httpRequest(this.request);

        if (!response) { // NOTE: Зачем?
            return {};
        }

        response = response.split(`<!>`);
        response = response.find(item => item.substring(0, 7) === `<!json>`);

        if (!response) {
            return {};
        }

        response = JSON.parse(response.substring(7));

        response.forEach(data => {
            const hash = data[13].split(`/`);
            const id = `${ data[1] }_${ data[0]}_${ hash[2]}_${ hash[5]}`;
            const item = this.has(id);

            item.setResponse(data);
        });

        return response;
    }
}

class List {
    constructor() {
        this.items = [];

        this.on_add = new kk.Event();
        this.on_change = new kk.Event();

        this.on_add.addListener(added => this.on_change.dispatch(added));
    }

    has(item) {
        if (item instanceof RequestItem) {
            return this.items.find(li => li.id === item.id);
        } else {
            return this.items.find(li => li.id === item);
        }
    }

    add(item, dispatch_event = true) {
        if (kk.is.A(item)) {
            item = item.map(item => this.add(item, true));
            dispatch_event && this.on_add.dispatch([item]);
            return item;
        }

        const existing_item = this.has(item);
        if (existing_item) {
            return existing_item;
        }

        if (!(item instanceof RequestItem)) {
            item = new RequestItem(item);
        }

        this.items.push(item);
        dispatch_event && this.on_add.dispatch([item]);

        return item;
    }
}

class Setting extends List {
    constructor(request_size) {
        super();

        this.request_size = request_size;

        Object.defineProperty(this, `is_there_enough`, {
            get: () => this.items.length >= this.request_size
        });
    }

    /**
     * Вырезать из набора N=size элементов и вернуть их.
     * @param {*} size
     */
    pull(size = this.request_size) {
        const items = this.items.splice(0, size);
        this.on_change.dispatch();
        return items;
    }
}

class Pending extends List {
    constructor() {
        super();
    }
}

class UrlsFromHost {
    constructor() {
        Object.defineProperties(this, {
            'request_size': { value: 10, writable: false }, // size_limit
            'waiting_time': { value: 180, writable: false }, // time_limit
        });

        this.setting = new Setting(this.request_size);
        this.pending = new Pending();

        this.waiting = null;

        this.responses = [];

        // on_adding_a_new_item_to_the_queue
        this.on_enrollment = new kk.Event();
        this.on_request = new kk.Event();
        this.on_response = new kk.Event();

//    let item_counter = 0;

        this.setting.on_add.addListener(item => {
            const self = this;

            if (this.setting.is_there_enough) {
                this.send_request();
            } else {
                if (this.waiting) {
                    clearTimeout(this.waiting);
                }

                this.waiting = setTimeout(
                    self.send_request.bind(self, null),
                    this.waiting_time
                );
            }
        });
    }

    send_request() {
        const self = this;

        if (this.waiting) {
            clearTimeout(this.waiting);
            this.waiting = null;
        }

        const request = new Request(self.setting.pull());
        this.pending.add(request.items);
        request.send();
    }

    convert_URL_m3u8_to_mp3(url) {
        var mp3u8 = (url = url.replace('/index.m3u8', '.mp3')).split('/');
        mp3u8.splice(mp3u8.length - (2 + (url.indexOf('audios') !== -1 ? 1 : 0)), 1);
        url = mp3u8.join('/');

        return url;
    }

    async get(id) {
        let response
        let item = this.pending.has(id);

        if (item) {
            response = await item.getResponse();
        } else {
            item = this.setting.add(id);
            response = await item.getResponse();
        }

        let url = void 0;
        const encoded_url = response[2];

        if (encoded_url.includes(`audio_api_unavailable`)) {
            url = sub.decodeURL(encoded_url);

            if (/\.m3u8\?/.test(url)) {
                url = this.convert_URL_m3u8_to_mp3(url);
            }

            if (url.includes(`audio_api_unavailable`)) {
                mod.warn(`audio_api_unavailable`);
            }
        } else {
            url = encoded_url;
        }

        url = url.replace(/^(.+?)\?.*/, `$1`);

        return url;

    }
}

sub.UrlsFromHost = new UrlsFromHost();

//tick
