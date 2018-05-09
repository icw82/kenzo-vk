// Синхронизация реестра файлов (registry.js) с очередью загрузок;
class Sync {
    constructor() {
        // E V E N T S
        // При изменении очереди загрузок провести синхронизацию
        // с реестром файлов:
        ext.modules.downloads.on_storage_changed.addListener(
            this.sync.bind(this));
    }

    sync(changes) {
//        console.log(`changes`, changes);
        // Проход по всем обработанным файлам (кнопкам) на странице:
        mod.registry.list.forEach(this.update.bind(this));
    }

    update (file) {
        // Поиск соответствия зарегистрированного файла и записи в очереди:
        const item = ext.modules.downloads.storage.queue.find(
            item => item.url === file.url.href);

        if (item) {
            file.state = item.state;
            file.queue_id = item.id;
            file.progress = item.progress;
        } else {
            file.state = 0;
            file.queue_id = false;
        }
    }
}
