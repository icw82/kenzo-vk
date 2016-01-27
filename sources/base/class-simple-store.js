//    store = new SimpleStore('database_name', 'store_name', version, key, [index_name, …]);

//    store.get('12312312').then(function(data) {
//
//    });

//    data = {id: 1000};
//    store.put(data).then(function() {
//
//    });


class SimpleStore {
    // database_name, version, store_name, key
    constructor() {
        self = this;

        Object.defineProperty(this, 'database_name', {get: () =>  arguments[0]});
        Object.defineProperty(this, 'version', {get: () => arguments[1]});
        Object.defineProperty(this, 'store_name', {get: () => arguments[2]});
        Object.defineProperty(this, 'key', {get: () => arguments[3]});
        Object.defineProperty(this, 'indexes', {get: () => arguments[4]});

        this.database = new Promise(function(resolve, reject) {
            const request = indexedDB.open(self.database_name, self.version); // IDBOpenDBRequest
//            error: null
//            onblocked: null
//            onerror: null
//            onsuccess: null
//            onupgradeneeded: null
//            readyState: "pending" → "done"
//            result: IDBDatabase
//            source: null
//            transaction: null

            request.onupgradeneeded = function(event) {
                if (request.result.objectStoreNames.contains(self.store_name)) {
                    request.result.deleteObjectStore(self.store_name);
                    console.log('Store: хранилище удалено');
                }

                var store = event.target.result.createObjectStore(
                    self.store_name, {keyPath: self.key});

                each(self.indexes, function(index) {
                    store.createIndex(index, index, {unique: false});
                });
            }

            request.onsuccess = function(event) {
                resolve(request.result);
            }

            request.onerror = function(event) {
                console.warn('Store onerror:', event);
                reject(event);
            }

            request.onblocked = function(event) {
                console.warn('Store onblocked:', event);
//                reject(event);
            }
        });
    }

    get(key_value) {
        var self = this;

        var promise = new Promise(function(resolve, reject) {
            self.database.then(function(db) {
//                console.warn('Store get: Fulfilled', db);

                var request = db.transaction([self.store_name], 'readonly') // IDBTransaction
                    .objectStore(self.store_name) // IDBObjectStore
                    .get(key_value);

                request.onsuccess = function(event) {
//                    console.warn('Store put: onsuccess', event);
                    if (typeof request.result === 'object')
                        resolve(request.result);
                    else
                        reject(event);
//                    db.close();
                }

                request.onerror = function() {
                    mod.warn('Store put transaction: onerror', event);
                    reject('Store put: error');
//                    db.close();
                }

            });

            self.database.catch(function(event) {
                console.warn('Store get: Rejected', event);
                reject(event);
            });
        });

        return promise;
    }

    put(data) {
        var self = this;

        var promise = new Promise(function(resolve, reject) {
//            console.warn('Store put: ', data);

            self.database.then(function(db) {
                var request = db.transaction([self.store_name], 'readwrite') // IDBTransaction
                    .objectStore(self.store_name) // IDBObjectStore
                    .put(data);


                request.onsuccess = function(event) {
//                    console.warn('Store put: onsuccess', event);
                    resolve();
//                    db.close();
                }

                request.onerror = function() {
                    mod.warn('Store put transaction: onerror', event);
                    reject('Store put: error');
//                    db.close();
                }
            });

            self.database.catch(function(event) {
                console.warn('Store put: Rejected', event);
                reject(event);
            });

        });

        return promise;
    }
}

ext.SimpleStore = SimpleStore;
