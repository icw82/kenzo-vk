mod.init__content = () => {
    // Синхронизация реестра файлов с очередью загрузок;
    mod.synchronizeQueue = new Sync();

    mod.on_loaded.dispatch();
};
