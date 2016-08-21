const sub = new ext.SubModule(mod, 'ids');

//let limit = 1000;
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
//    if (limit == 0)
//        return;

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

        if (each (ignore_regexp, function(regexp){
            if (regexp.test(page))
                return true;
        })) return;

        let header = ext.dom.vk.body.querySelector('.page_top');

        if (!header)
            return;

        header.classList.add('kzvk-ui-page-header');

        get_id (page).then(data => {
            if (element) {
                if (header.contains(element))
                    return;
                else
                    element = false;
            }

            element = create (header, data.id, data.type);
            header.appendChild(element);

        }, error => {
            mod.warn('get_id error >', error);
        });
    }
//    limit--;
};

let create = (container, id, type) => {
    let element = document.createElement('div');
    element.classList.add('kzvk-ui-id');

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

    element.innerHTML = html + id + '">' + id + '</a><br />';

    return element;
}

sub.init__content = () => {
    ext.events.on_mutation.addListener(mutations => {
        if (ext.options.ui__ids) {
            check();
        }
    });
}
