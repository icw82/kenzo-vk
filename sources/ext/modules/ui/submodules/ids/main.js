let cache = [];

let ignore = [
    'feed',
    'im',
    'friends',
    'video',
    'groups',
    'search',
    'settings',
    'apps',
    'fave',
    'docs'
];

let ignore_regexp = [
    /photo(-?\d+_\d+)/,
    /audios(-?\d+)/,
    /albums(-?\d+)/,
    /album(-?\d+_\d+)/,
    /video(-?\d)/,
    /app(\d+_\d+)/
];

let element = false;

let promise = name => new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let url = 'https://api.vk.com/method/utils.resolveScreenName?screen_name=' + name;
    // v = 5.0?
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4)
            return;
        if (xhr.status === 200) {
            let data = JSON.parse(this.response);

            if (data.error) {
                reject({
                    name: name,
                    data: data
                });
                return;
            } else if (!data.response) {
                if (!data.response.object_id) {
                    reject({
                        name: name,
                        response: response
                    });
                } else {
                    reject({
                        name: name,
                        data: data
                    });
                }

                return;
            }

            resolve({
                id: data.response.object_id,
                type: data.response.type
            });
        }
    }

    xhr.send();
});

let get_id = page => new Promise((resolve, reject) => {
    each (cache, item => {
        if (item.page === page) {
            if (item.type) {
                resolve({
                    id: item.id,
                    type: item.type
                });
            }
            return item;
        }
    }, () => {
        let item = {
            page: page,
            promise: promise(page)
        };

        cache.push(item);

        item.promise.then(data => {
            item.id = data.id;
            item.type = data.type;
            delete item.promise;
            resolve(data);
        }).catch(e => {
            mod.warn('>', e);
        });

        return item;
    });
});

let check = () => {
    if (!ext.dom.vk)
        return;

    if (ext.mode == 2016) {
        if (
            !document.body.querySelector('#profile') &&
            !document.body.querySelector('#group') &&
            !document.body.querySelector('#public')
        ) return;

        let page = window.location.pathname.match(/\/(.+)/)[1];

        if (ignore.includes(page))
            return;

        if (each (ignore_regexp, regexp => {
            if (regexp.test(page))
                return true;
        })) return;

        const page_content = ext.dom.vk.body.querySelector('#content');
        const narrow_column = page_content.querySelector('#narrow_column');
        const page_block = page_content.querySelector('.page_block');

        get_id(page).then(data => {
            if (element) {
                if (page_content.contains(element))
                    return;
                else
                    element = false;
            }

            element = create(data.id, data.type);

            sub.log(element)

            if (page_block) {
                page_block.classList.add('kzvk-ui-id-container');
                page_block.appendChild(element);
            } else if (narrow_column) {
                narrow_column.classList.add('kzvk-ui-id-container');
                narrow_column.appendChild(element);
            } else {
                sub.warn('Место под идентификатор не найдено');
            }

        }, error => {
            mod.warn('get_id error >', error);
        });
    }
};

let create = (id, type) => {
    let element = document.createElement('div');
    element.classList.add('kzvk-ui-id');
    element.classList.add('kzvk-ui-id--' + type);

    let html = '<a href="/';

    if (type == 'user') {
        html += 'id';
    } else if (type == 'group') {
        html += 'club';
    } else if (type == 'page') {
        html += 'public';
    } else  if (type == 'event') {
        html += 'event';
    } else {
        mod.warn('Неучтённый тип страницы:', type);
        return;
    }

    html += id + '" title="' + kk.format.number(id) + '"';

    element.innerHTML = html + '>' + id + '</a><br />';

    return element;
}

sub.init__content = () => {
    core.events.on_mutation.addListener(mutations => {
        if (sub.mod.options._ && sub.mod.options.ids) {
            check();
        }
    });
}
