sub.cache = new core.SimpleStore({
    name: 'kenzo-host-service-audio',
    version: 1,
    store: {
        name: 'audio',
        key: 'id',
        indexes: ['url']
    }
});

sub.expiration = 1000 * 60 * 60 * 10; // 10 Часов
