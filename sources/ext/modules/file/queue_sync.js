// Синхронизация реестра файлов (registry.js) с очередью загрузок;
mod.queue_sync = (() => {
    const _ = {};

    _.init = () => {
        // При изменении очереди загрузок провести синхронизацию
        // с реестром файлов:
        ext.modules.downloads.on_storage_changed.addListener(_.sync);
    }

    _.sync = () => {
        // Перебор зарегистированных на странице файлов:
        each (mod.registry.list, _.update);
    }

    _.update = file => {
        // Поиск соответствия зарегистрированного файла и записи в очереди:
        let item = each (ext.modules.downloads.storage.queue, item => {
            // Первая попавшаяся запись с этим URL:
            if (item.url === file.clean_url) {
                return item;
            }
        });

        if (item) {
            file.state = item.state;
            file.queue_id = item.id;
            file.progress = item.progress;
        } else {
            file.state = 0;
            file.queue_id = false;
        }
    }

    return _;

})();

