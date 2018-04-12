mod.init__content = () => {
    // Синхронизация реестра файлов с очередью загрузок;
    mod.queue_sync.init();

    mod.on_loaded.dispatch();
};
