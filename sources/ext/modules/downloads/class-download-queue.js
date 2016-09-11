class DownloadQueue {
//     0 — removal (исключение)
//     1 — pending (в очереди)
//     2 — active (скачивается)
//     3 — paused (скачивание на паузе)

// TODO: Сортировка по дате

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

        // FUTURE: изоляция
        this.queue = [];
        this.loop__interval = false;
        this.loop__interval_duration = 1200;
        this.max_active = 10;

        // Последний использованный идентификатор
        chrome.storage.local.get('downloads__count', function(data) {
            self.count = data.downloads__count;
//            console.log('queue.COUNT', self.count);
        });

        // Первая и последняя зягрузка из хранилища потому что хранилище
        // обновляется только этим скриптом, запущеном в едиственном экземпляре.
        chrome.storage.local.get('downloads', function(data) {

            if (data.downloads)
                self.queue = data.downloads;

            // Синхронизация
            self.sync();

            // Создание слушателя хром-загрузок
            // Нужно для того, чтобы:
            //  — отслеживание состояния прогресса (хром не предоставлят для этого возможностей);
            //  — встраивать в очередь те загрузки, которые были созданы вне экосистемы расширения;
            chrome.downloads.onChanged.addListener(function(delta) {
//                mod.log('delta', delta);
                if (
                    ('filename' in delta) || // Новый
                    ('paused' in delta) ||   // Пауза
                    ('state' in delta)       // Завершение
                ) {
                    chrome.downloads.search({id: delta.id}, function() {
                        self.update(self.convert(arguments[0][0]));
                        self.loop(); // Для включения
                    });
                }
            });
        });

//        chrome.downloads.onCreated.addListener(function() {
//            // Создание задачи
//            console.log('downloads.onCreated', arguments);
//        });
//
//        chrome.downloads.onErased.addListener(function() {
//            console.log('downloads.onErased', arguments);
//        });

        // События
        this.on_add = new kk.Event();
        this.on_remove = new kk.Event();

        this.on_add.addListener(self.check.bind(self));
        this.on_remove.addListener(self.check.bind(self));

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

        chrome.downloads.search({}, function(downloads) {
            let ids = [];
            let to_update = [];

            // Со стороны Хром-загрузок
            each (downloads, function(download) {
                ids.push(download.id);

                // Конвертирование
                let item = self.convert(download);
                to_update.push(item);
            });

            // Со стороны Очереди
            each (self.queue, function(item) {
                // Проверка на несоответствие (когда элемент очереди
                //     ссылается на несуществующую загрузку)
                // + Выпиливание неформатных записей из очереди

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

                    if (!ids.includes(item.chrome_id)) {
                        item.state = 0;
                        item.reason = 'missing';
                        to_update.push(item);
                        return;
                    }
                }

            });

//            console.log('to_update', to_update);
//            console.log('SYNC QUEUE', self.queue);

            if (to_update.length > 0) {
                self.update(to_update);
            }

            self.loop();
            self.check();
        });
    }

    // Создаёт хром-загрузки по элементам очереди, находящимися в ожидании,
    // если количество активных загрузок меньше допустимого (max_active)
    check () {
        const self = this;

        if (self.queue.length === 0)
            return;

        const in_pending = self.queue.filter( (i) => i.state === 1);
        const in_process = self.queue.filter( (i) => i.state === 2 || i.state === 3);

        if (in_process.length < self.max_active) {
            if (in_pending.length > 0) {
                let options = {
                    url: in_pending[0].url,
                    conflictAction: 'overwrite' // 'prompt' // 'uniquify' // 'overwrite'
                }

                if (in_pending[0].name)
                    options.filename = core.utils.filter.file_name(in_pending[0].name);

                chrome.downloads.download(options, function(id) {
                    in_pending[0].chrome_id = id;
                    mod.log('ID:', in_pending[0]);
                    mod.log('ID:', id);
                });
            }
        }
    }

    update_storage (changes) {
        if (!(changes.added || changes.removed || changes.updated))
            return;

        const self = this;
        const data = {
            downloads: this.queue,
            downloads__count: this.count
        };
        chrome.storage.local.set(data, function() {
//            chrome.storage.local.get(function(data) {
//                console.log('UPDATED STORAGE', data);
//            });
            if (changes.added > 0)
                self.on_add.dispatch();
            if (changes.removed > 0)
                self.on_remove.dispatch();
//            if (changes.updated > 0)
//                self.on_update.dispatch();

        });
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

    // Синхронизационный цикл (Прогресс, Пауза)
    // Автоматически продолжается, пока есть хотя бы одна активная загрузка не на паузе;
    loop () {
        const self = this;
        let stop = true;
        let to_update = [];

//        console.log('————————————— loop —————————————');

        chrome.downloads.search({
            state: 'in_progress' // Только активные хром-загрузки и загрузки на паузе
        }, function(downloads) {
            each (downloads, function(download) {
                // Прогресс
                to_update.push(self.convert(download));

                // Пауза
                if (!download.paused)
                    stop = false;
            });

            if (to_update.length > 0) {
                self.update(to_update);
            }

            if (stop) {
                clearInterval(self.loop__interval);
                self.loop__interval = false;
//                mod.log('stop loop');

            } else if (self.loop__interval === false) {
//                mod.log('set loop');
                self.loop__interval = setInterval(function() {
                    self.loop();
                }, self.loop__interval_duration);
            }
        });
    }

    get (id) {
        const self = this;

        return each (self.queue, function(item) {
            if (item.id === id)
                return item;
        });
    }

    // Основной метод изменяющий очередь
    // U — обновление
    // Q — элемент очереди
    update (list) {
        const self = this;
        let changes = {
            updated: 0,
            added: 0,
            removed: 0
        };

        if (!(list instanceof kk._A)) {
            if (typeof list !== kk._o) {
                kk.__a;
                return;
            }

            list = [list];
        }

//        mod.log('————————————— update —————————————');

        each (list, function(u) {
            if (!u.url) {
                mod.warn('Не указан URL');
                return;
            }

            if (u.id) {
                let q = find(u, 'id');
                if (q) {
                    apply(u, q);
                }
            } else {
                if (u.chrome_id) {
                    let q = find(u, 'chrome_id');
                    if (q) {
                        apply(u, q);
                    } else {
                        if (u.state === 0) {
                            remove(u);
                        } else {
                            add(u);
                        }
                    }
                } else {
                    if (u.state === 0) {
                        mod.warn('Нельзя удалить элемент только по URL');
                    } else {
                        let q = find(u, 'url');
                        if (q) {
                            mod.warn('Элемент с таким же URL уже находится в очереди');
                        } else {
                            add(u);
                        }
                    }
                }
            }

        });

//        mod.log('queue', self.queue);
        self.update_storage(changes);

        // FUTURE: присобачить информацию из кэша.

        // NOTE: С какого числа начинается отсчёт chrome_id?
        function find (u, key) {
            if (u[key] === null)
                return;

            return each (self.queue, function(q) {
                if (u[key] === q[key])
                    return q;
            });
        }

        function apply(u, q) {
            if (u.state === 0) {
                remove(u, q);
            } else {
                if (u.state === 1 && q.state !== 1) {
                    mod.warn('Нельзя изменить активное состояние на состояние ожидания')
                } else {
                    update(u, q);
                }
            }
        }

        function history(item) {
            mod.history.update(item);
//            mod.log('TO HISTORY');
        }

        function remove(u, q) {
            if (u.reason === 'completed') {
                history(u);
            }

            if (q) {
                self.queue.splice(self.queue.indexOf(q), 1);
                changes.removed++;

//                mod.log('REMOVED');
            }
        }

        function add (u) {
            self.count++;
            u.id = self.count;
            u.time__added = kk.ts();

            self.queue.push(u);
            changes.added++;

//            mod.log('ADDED');
//            mod.log('chrome_id →', u.chrome_id);
//            mod.log('url →', u.url);
        }

        function update (u, q) {
            // Обновляемые свойства (не могут измениться на NULL):
            let updated = false;

            if (q.chrome_id !== null && q.chrome_id !== u.chrome_id) {
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

            each (keys, function(key) {
                if (!(key in u) || u[key] === null)
                    return;

                if (q[key] !== u[key]) {
                    q[key] = u[key];
                    updated = true;
                }
            });

            if (updated) {
                changes.updated++;
//                mod.log('UPDATE');
            }
        }
    }

    // Метод добавления элемента в очередь.
    // Внутри класса не используется.
    add (input) {
        const self = this;
        let as_group = false;
        let to_update = [];

        if (input instanceof kk._A)
            as_group = true;
        else
            input = [input];

        each (input, function(item) {
            if (typeof item.url !== kk._s) {
                kk.__a();
                return;
            }

            let update = {
                url: item.url
            }

            if (typeof item.name === kk._s)
                update.name = item.name;

            if (typeof item.module === kk._s)
                update.module = item.module;

            if (as_group) {
                // TODO: Группы
            }

            to_update.push(Object.assign(self.default, update));

        });

        if (to_update.length > 0) {
            self.update(to_update);
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
                    chrome.downloads.cancel(item.chrome_id);
                }
            }
        });

        if (to_update.length > 0) {
            self.update(to_update);
        }
    }

    remove_group (input) {
        const self = this;

    }

    clear () {
//        chrome.storage.local.set({downloads: []});
    }

}

mod.DownloadQueue = DownloadQueue;
