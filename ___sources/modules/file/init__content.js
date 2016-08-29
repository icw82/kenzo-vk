mod.init__content = function() {
    // Синхронизация реестра файлов с очередью загрузок;
    mod.queue_sync.init();

    mod.on_loaded.dispatch();
};
