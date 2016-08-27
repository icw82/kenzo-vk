// Обёртка IDB для простых операций с одним хранилищем (storage);
class SimpleStore {
    constructor(schema) {
        if (!kk.is_o(schema))
            throw kk.msg.ia;

        if (!kk.is_s(schema.name))
            throw kk.msg.ia;

        if (!kk.is_o(schema.store))
            throw kk.msg.ia;

        if (!kk.is_s(schema.store.name))
            throw kk.msg.ia;

        // Если версия не указана и база с таким названием не найдена,
        // то будет создана база данных указанным названием и версией 1.

        // Если версия не указана и база с таким названием найдена,
        // то соединение с ней будет открыто без изменения версии
        // (то есть с текущей версией).

        if (('version' in schema) && !kk.is_n(schema.version))
            throw kk.msg.ia;

        const self = this;

        this.schema = schema;

        this.db = new Promise((resolve, reject) => {
            const request = indexedDB.open(schema.name, schema.version);

            request.onupgradeneeded = self.upgrade.bind(self);

            request.onsuccess = event => resolve(request.result);

            request.onerror = event => reject(event);

            request.onblocked = event => reject(event);
        });
    }

    upgrade (event) {
        const self = this;
        const database = event.target.result;
        const name = this.schema.store.name;
        const key = this.schema.store.key || false;
        const indexes = kk.is_A(this.schema.store.indexes) ? this.schema.store.indexes : [];
        const options = {};

        if (database.objectStoreNames.contains(name)) {
            database.deleteObjectStore(name);
            console.log('SimpleStore: хранилище удалено');
        }

        if (key) {
            options.keyPath = key;
        } else {
            options.autoIncrement = true;
        }

        const store = database.createObjectStore(name, options);

        each (indexes, name => {
            store.createIndex(name, name);
        });
    }

    put (data) {
        const self = this;

        return new Promise((resolve, reject) => {
            self.db.then(db => {
                const request = db
                    .transaction(self.schema.store.name, 'readwrite')
                    .objectStore(self.schema.store.name)
                    .put(data);

                request.onsuccess = event => {
                    resolve(event.target.result);
//                    db.close(); // closePending

                };

                request.onerror = event => {
                    reject(event);
                };

            }, reject);
        });
    }

    get (id, index) {
        const self = this;

        return new Promise((resolve, reject) => {
            self.db.then(db => {
                let store = db
                    .transaction(self.schema.store.name, 'readonly')
                    .objectStore(self.schema.store.name);

                if (kk.is_s(index) && self.schema.store.indexes.includes(index)) {
                    store = store.index(index);

                    const key = IDBKeyRange.only(id);
                    const request = store.openCursor(key);
                    const result = [];

                    request.onsuccess = event => {
                        let cursor = event.target.result;

                        if (cursor) {
                            result.push(cursor.value);
                            cursor.continue();
                        } else {
                            if (result.length > 0)
                                resolve(result);
                            else
                                reject(event);
                        }
                    }

                    request.onerror = event => {
                        reject(event);
                    };
                } else {
                    let request = store.get(id);
                    request.onsuccess = event => {
                        if (request.result)
                            resolve(request.result);
                        else
                            reject();
                    }

                    request.onerror = event => {
                        reject(event);
                    };
                }

            }, reject);
        });
    }

    // TODO: delete
    delete (id, index) {

    }

    drop () {

    }
}

ext.SimpleStore = SimpleStore;

//ext.test = new ext.SimpleStore({
//    name: 'test-db',
//    version: 9,
//    store: {
//        name: 'test',
//        key: false,
//        indexes: ['url', 'a.b', 'type']
//    }
//});
//
//ext.test.put({
//    url: 'https://example.com',
//    a: {
//        b: 4
//    },
//    type: 'video'
//}).then(console.log);
//
//ext.test.get(5, 'a.b').then(console.log);
