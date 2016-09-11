mod.vk = (mod => {
    const vk = {};

    // TODO: Допилить
    const cache = new core.SimpleStore({
        name: 'kenzo-vk-audio',
        version: 4,
        store: {
            name: 'audio',
            key: 'id',
            indexes: ['url']
        }
    });

    const queue = [];
    const on_response = new kk.Event();
    const on_adding_a_new_item_to_the_queue = new kk.Event();
    let item_counter = 0;

    const size_limit = 10;
    const time_limit = 250;
    let timer = false;

    const pending = [];
    let requests_counter = 0;

    const responses = [];

    // TODO: Возможно стоит сделать некий таймер для сброса кэша?

    vk.get_url = id => new Promise((resolve, reject) => {
        const get_and_record = () => {
            vk.get_url_from_vk(id).then(url => {
                cache.put({
                    id: id,
                    url: url,
                    ts: kk.ts()
                });
                resolve(url);
            }, reject);
        }

        cache.get(id).then(data => {
            if (kk.is_o(data)) {
                if (data.ts + 43200000 > kk.ts()) { // 12 часов
                    resolve(data.url);
                } else {
                    core.utils.is_url_exists(data.url).then(() => {
                        resolve(data.url);
                    }, get_and_record);
                }
            } else {
                get_and_record();
            }
        }, get_and_record);

    });

    vk.get_url_from_vk = id => new Promise((resolve, reject) => {
        let item_id = add_to_the_queue(id);

        const listner = () => {
            let url = each (responses, (response, i) => {
                let index = response.requests.indexOf(item_id);
                if (index >= 0) {
                    let url = response.url;
                    response.requests.splice(index, 1);

                    if (response.requests.length === 0)
                        responses.splice(i, 1);

                    return url;
                }
            });

            if (kk.is_s(url)) {
                url = url.replace(/^(.+?)\?.*/, '$1');
                on_response.removeListener(listner);
                resolve(url);
            } else if (url === false) {
                mod.warn('В ответе сервера небыло подходящего URL');
                reject();
            }
        }

        on_response.addListener(listner);
    });

    const add_to_the_queue = id => {
        item_counter++;
        const item_id = item_counter;

        each (queue, item => {
            if (item.id === id) {
                item.requests.push(item_id);
                return;
            }
        }, () => {
            queue.push({
                id: id,
                requests: [item_id]
            });
        });

        // Если в ожидании?

        on_adding_a_new_item_to_the_queue.dispatch();
        return item_id;
    }

    on_adding_a_new_item_to_the_queue.addListener(() => {
        if (queue.length >= size_limit) {
            request();
        } else {
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(request, time_limit);
        }
    });

    const request = () => {
        requests_counter++;

        if (timer !== false) {
            clearTimeout(timer);
            timer = false;
        }

        let request = {
            id: requests_counter,
            items: queue.splice(0, size_limit)
        }

        if (request.items.length > 0) {
            pending.push(request);
            send(request);
        }
    }

    const send = request => {
//        console.log('request', request);
//        console.log('requests_counter', requests_counter);

        const ids = [];
        each (request.items, item => {
            ids.push(item.id);
        })

        let xhr = new XMLHttpRequest();
        let url = 'https://vk.com/al_audio.php';
        let query = {
            act: 'reload_audio',
            al: 1,
            ids: ids.join(',')
        }

    //        load_silent
    //        band:false
    //        owner_id:170344789

        let encoded_query = [];

        for (let key in query) {
            encoded_query.push(key + '=' + encodeURIComponent(query[key]));
        }
        encoded_query = encoded_query.join('&');

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = xhr.response.split('<!>');
                each (response, (item, i) => {
                    if (item.substring(0, 7) === '<!json>') {
                        response[i] = JSON.parse(item.substring(7));
                    }
                });

                const data = response[5];

                if (each (pending, (item, i) => {
                    if (item.id === request.id) {
                        return pending.splice(i, 1);
                    }
                })) {
                    if (data) {
                        each (request.items, item => {
                            let url = each (data, info => {
                                let id = info[1] + '_' + info[0];
                                if (id === item.id)
                                    return info[2]
                            });

                            if (url) {
                                item.url = url;
                            } else {
                                item.url = false;
                            }

                            responses.push(item);
                        });

                    } else {
                        mod.warn('Странность №2: нет данных в ответе');

                        // Таймер и повторная отсылка?

                    }
                } else {
                    mod.warn('Странность №1: запрос отсутсвет в списке ожидания');
                }

                on_response.dispatch();
            }
        }

        xhr.send(encoded_query);
    };

    return vk;

})(mod);
