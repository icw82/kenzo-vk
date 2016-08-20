mod.init__content = function() {
    // Синхронизация реестра файлов с очередью загрузок;
    mod.queue_sync.init();

    mod.dispatch_load_event();
};
