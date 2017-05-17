class DownloadQueue {
//     0 — removal (исключение)
//     1 — pending (в очереди)
//     2 — active (скачивается)
//     3 — paused (скачивание на паузе)

// TODO: Сортировка по дате (Зачем?)

    get sources () {
        return ['ext', 'chrome'];
    }

    get default () {
        return {
            state: 1,

            id: null,
            group: null,
            url: null,
            name: null,
            module: null,

            chrome_id: null,
            mime: null,
            progress: null,
            reason: null,

            time__added: null, // NOTE: Что будет, если произойдёт изменение системного времени?
            time__start: null,
            time__end: null,

            priority: null
        }
    }

    constructor () {
        const self = this;

        this.loop__interval = false;
        this.loop__interval_duration = 1200;
        this.max_active = 4; // TODO: Опцией

//        mod.on_storage_changed.addListener(changes => {
//            console.log('— storage changes →', changes, mod.storage.queue.length);
//        });

        // Последний использованный идентификатор
        mod.log('counter', mod.storage.count);

        // События
        this.on_add = new kk.Event();
        this.on_remove = new kk.Event();

        this.on_add.addListener(() => {
            self.check('on_add')
        });
        this.on_remove.addListener(() => {
            self.check('on_remove')
        });

        // Синхронизация
        self.sync();

        // Создание слушателя хром-загрузок
        // Нужно для того, чтобы:
        //  — отслеживание состояния прогресса (хром не предоставлят для этого возможностей);
        //  — встраивать в очередь те загрузки, которые были созданы вне экосистемы расширения;
        browser.downloads.onChanged.addListener(delta => {
            if (
                ('filename' in delta) || // Новый
                ('paused' in delta) ||   // Пауза
                ('state' in delta)       // Завершение
            ) {
//                mod.log('delta', delta);
                browser.downloads.search({id: delta.id}, result => {
                    const update = self.convert(result[0]);
                    self.update(update, 'delta');
                    self.loop('delta'); // Для включения
                });
            }
        });

//        browser.downloads.onCreated.addListener(function() {
//            // Создание задачи
//            console.log('downloads.onCreated', arguments);
//        });
//
//        browser.downloads.onErased.addListener(function() {
//            console.log('downloads.onErased', arguments);
//        });

    }

    // Конвертирование хром-загрузки в формат элемента очереди
    convert (download) {
        const self = this;

        if (!('id' in download)) {
            mod.warn('convert:', 'Нет идентификатора');
            return;
        };

        let update = {
            chrome_id: download.id,

            url: download.url,
            name: download.filename.replace(/.+(?:[\/\\])(.+?)$/, '$1'),
            progress: Math.floor(download.bytesReceived / download.totalBytes * 100) || null,

            time__start: Date.parse(download.startTime) || null,
            time__end: Date.parse(download.endTime) || null,

            mime: download.mime || null
        }

        if (download.state == 'in_progress') {
            if (download.paused)
                update.state = 3;
            else
                update.state = 2;

        } else if (download.state == 'complete') {
            update.state = 0;
            update.reason = 'completed';

        } else if (download.state == 'interrupted') {
            update.state = 0;
            update.reason = 'interrupted';
            // FUTURE: Оповещение пользователя об ошибке

//"FILE_FAILED", "FILE_ACCESS_DENIED", "FILE_NO_SPACE", "FILE_NAME_TOO_LONG", "FILE_TOO_LARGE", "FILE_VIRUS_INFECTED", "FILE_TRANSIENT_ERROR", "FILE_BLOCKED", "FILE_SECURITY_CHECK_FAILED", "FILE_TOO_SHORT", "FILE_HASH_MISMATCH", "NETWORK_FAILED", "NETWORK_TIMEOUT", "NETWORK_DISCONNECTED", "NETWORK_SERVER_DOWN", "NETWORK_INVALID_REQUEST", "SERVER_FAILED", "SERVER_NO_RANGE", "SERVER_BAD_CONTENT", "SERVER_UNAUTHORIZED", "SERVER_CERT_PROBLEM", "SERVER_FORBIDDEN", "SERVER_UNREACHABLE", "USER_CANCELED", "USER_SHUTDOWN", or "CRASH"

        }

        return Object.assign(self.default, update);
    }

    // Синхронизация
    //
    // Запускаяется единственный раз при загрузке модуля.
    // Выявляет изменения в очереди, произошедшие в то время,
    // когда расширение не работало.
    // Последующая синхронизация при работающем модуле не нужна,
    // так как большинство изменений в хром-загрузках вызывают события,
    // слушая которые, модуль регистрирует изменения.
    sync () {
        const self = this;

        browser.downloads.search({}, downloads => {
            const ids = [];
            const to_update = [];

            // Со стороны Хром-загрузок
            each (downloads, download => {
                ids.push(download.id);
                to_update.push(self.convert(download));
            });

            // Со стороны Очереди
            each (mod.storage.queue, item => {
                // Выпиливание неформатных записей из очереди

                if (!('state' in item)) {
                    item.state = 0;
                    item.reason = 'wrong';
                    to_update.push(item);
                    return;
                }

                if (item.state === 1 && (item.chrome_id !== null)) {
                    item.state = 0;
                    item.reason = 'wrong';
                    to_update.push(item);
                    return;
                }

                if (item.state === 2 || item.state === 3) {
                    if (!('chrome_id' in item)) {
                        item.state = 0;
                        item.reason = 'wrong';
                        to_update.push(item);
                        return;
                    }

                    // Элемент очереди выпиливается, если он ссылается
                    // на несуществующую загрузку
                    if (!ids.includes(item.chrome_id)) {
                        item.state = 0;
                        item.reason = 'missing';
                        to_update.push(item);
                        return;
                    }
                }
            });

//            console.log('to_update', to_update);

            if (to_update.length > 0) {
                self.update(to_update, 'sync');
            }

            self.loop('sync');
            self.check('sync');
        });
    }

    // Синхронизационный цикл (Прогресс, Пауза)
    // Автоматически продолжается, пока есть хотя бы одна активная загрузка не на паузе;
    loop (source) {
        const self = this;
        let stop = true;
        let to_update = [];
        let query = {
            // Только активные хром-загрузки и загрузки на паузе
            state: 'in_progress'
        };

        browser.downloads.search(query, downloads => {
//            console.log('————————————— loop (' + source + ') —————————————');
            each (downloads, download => {
                // Прогресс
                to_update.push(self.convert(download));

                // Не на паузе
                if (!download.paused)
                    stop = false;
            });

            if (to_update.length > 0) {
                self.update(to_update, 'loop');
            }

            if (stop) {
                clearInterval(self.loop__interval);
                self.loop__interval = false;
//                mod.log('stop loop');

            } else if (self.loop__interval === false) {
//                mod.log('set loop');
                self.loop__interval = setInterval(() => {
                    self.loop('self');
                }, self.loop__interval_duration);
            }
        });
    }

    // Создаёт хром-загрузки по элементам очереди, находящимися в ожидании,
    // если количество активных загрузок меньше допустимого (max_active)
    check (source) {
        const self = this;

        if (mod.storage.queue.length === 0)
            return;

        const in_pending = mod.storage.queue.filter( (i) => i.state === 1 );
        const in_process = mod.storage.queue.filter( (i) => i.state === 2 || i.state === 3 );

//        console.log('————————————— check (' + source + ') —————————————');
//        mod.log('in_pending >>>', in_pending);
//        mod.log('in_process >>>', in_process);

        if (in_process.length < self.max_active) {
            if (in_pending.length > 0) {
                let next = in_pending[0];
                let options = {
                    url: next.url,
                    conflictAction: 'overwrite' // 'prompt' // 'uniquify' // 'overwrite'
                }

                if (next.name)
                    options.filename = core.utils.filter.file_name(next.name);

                browser.downloads.download(options, id => {
                    let item = each (mod.storage.queue, item => {
                        if (item.id === next.id) {
                            return item;
                        }
                    });
                    item.chrome_id = id;
                    core.storage.save('download-queue/check');
                });
            }
        }
    }

    get (id) {
        const self = this;

        return each (mod.storage.queue, item => {
            if (item.id === id)
                return item;
        });
    }

    // Основной метод изменяющий очередь
    // U — обновление
    // Q — элемент очереди
    update (updates, source) {
        const self = this;
        const changes = {
            updated: 0,
            added: 0,
            removed: 0
        };

        if (!kk.is_A(updates)) {
            if (!kk.is_o(updates)) {
                kk.__a;
                return;
            }

            updates = [updates];
        }

        // Отправка в историю
        const send_to_history = item => {
            mod.history.update(item);
//            mod.log('TO HISTORY');
        }

        // Удаление элемента из очереди
        const remove_item = (update, item) => {
            if (update.reason === 'completed') {
                send_to_history(update);
            }

            // item передаётся через apply и всегда указывает
            // на существующий в очереди элемент
            if (item) {
                mod.storage.queue.splice(mod.storage.queue.indexOf(item), 1);
                changes.removed++;
            }
        }

        // Обновление элемента очереди
        const update_item = (update, item) => {
            // Обновляемые свойства (не могут измениться на null):
            let updated = false;

            if (item.chrome_id !== null && item.chrome_id !== update.chrome_id) {
                mod.warn('Нельзя менять существующий chrome_id');
                return;
            }

            let keys = [
//                'id',
//                'group',
//                'url',
                'name', // FUTURE: При каких условиях может обновиться?
//                'time__added',
//                'module',
                'chrome_id', // Может отсутствовать у элемента в очереди;
                'state',
                // 'reason', // В очереди не может быть элементов со state == 0;
                'progress',
                'time__start',
                'time__end',
                'mime',
                'priority' // FUTURE: Изменение порядка очереди;
            ];

            each (keys, key => {
                if (!(key in update) || update[key] === null)
                    return;

                if (item[key] !== update[key]) {
                    item[key] = update[key];
                    updated = true;
                }
            });

            if (updated) {
                changes.updated++;
            }
        }

        // Поиск соответсвия обновления элементу очереди,
        // где key — ключ, по которому определяется соответсвие (id, chrome_id, url)
        const find = (update, key) => {

            if (update[key] === null)
                return;

            let result = each (mod.storage.queue, item => {
                if (update[key] === item[key])
                    return item;
            });

//            console.log('[ find ]', update[key], ' → ', result);

            return result;
        }

        // Применение обновления (update) к элементу очереди (item)
        const apply = (update, item) => {
            if (update.state === 0) {
                remove_item(update, item);
            } else {
                if (update.state === 1 && item.state !== 1) {
                    mod.warn('Нельзя изменить активное состояние на состояние ожидания')
                } else {
                    update_item(update, item);
                }
            }
        }

        // Добавление элемента в очередь
        const add_item = update => {
            mod.storage.count++;
            update.id = mod.storage.count;
            update.time__added = kk.ts();

            mod.storage.queue.push(update);
            changes.added++;
        }

        each (updates, update => {
            if (!update.url) {
                mod.warn('Не указан URL');
                return;
            }

//            console.log('— update (' + source + ') →', update, update.id);

            if (update.id) {
                // Если обновлению соответсвует элемент очереди
                const item = find(update, 'id');
                if (item) {
                    apply(update, item);
                }
            } else {
                if (update.chrome_id) {
                    const item = find(update, 'chrome_id');

                    if (item) {
                        apply(update, item);
                    } else {
                        if (update.state === 0) {
                            remove_item(update);
                        } else {
                            add_item(update);
                        }
                    }
                } else {
                    if (update.state === 0) {
                        mod.warn('Нельзя удалить элемент только по URL');
                    } else {
                        const item = find(update, 'url');
                        if (item) {
                            mod.warn('Элемент с таким же URL уже находится в очереди');
                        } else {
                            add_item(update);
                        }
                    }
                }
            }
        });

        // FUTURE: присобачить информацию из кэша. Зачем?

//        mod.log('queue', mod.storage.queue);
        self.update_storage(changes);
    }

    update_storage (changes) {
        if (!(changes.added || changes.removed || changes.updated))
            return;

        const self = this;

//        console.log('changes:', changes)

        core.storage.save('download-queue/update_storage').then(() => {
            if (changes.added > 0)
                self.on_add.dispatch();
            if (changes.removed > 0)
                self.on_remove.dispatch();
//            if (changes.updated > 0)
//                self.on_update.dispatch();
        });
    }

    // Метод добавления элемента в очередь.
    // Внутри класса не используется.
    add (input) {
        const self = this;
        let as_group = false;
        let to_update = [];

        if (kk.is_A(input))
            as_group = true;
        else
            input = [input];

        each (input, item => {
            if (!kk.is_s(item.url)) {
                kk.__a();
                return;
            }

            let update = {
                url: item.url
            }

            if (kk.is_s(item.name))
                update.name = item.name;

            if (kk.is_s(item.module))
                update.module = item.module;

            if (as_group) {
                // TODO: Группы
            }

            to_update.push(Object.assign(self.default, update));

        });

        if (to_update.length > 0) {
            self.update(to_update, 'add');
        }
    }

    // Метод удаления элемента из очереди.
    // Внутри класса не используется.
    remove (input) {
        const self = this;
        let to_update = [];

        if (input instanceof kk._A)
            as_group = true;
        else
            input = [input];

        each (input, function(id) {
            let item = self.get(id);

            if (item) {
                if (item.state === 1) {
                    // Элемент в ожидании;
                    item.state = 0;
                    item.reason = 'canceled';
                    to_update.push(item);

                } else if (item.state === 2 || item.state === 3) {
                    browser.downloads.cancel(item.chrome_id);
                }
            }
        });

        if (to_update.length > 0) {
            self.update(to_update, 'remove');
        }
    }

    remove_group (input) {
        const self = this;

    }

    clear () {
//        browser.storage.local.set({downloads: []});
    }

}

mod.DownloadQueue = DownloadQueue;
