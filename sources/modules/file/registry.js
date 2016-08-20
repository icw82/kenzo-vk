// Реестр используемых на странице файлов (класс File)
mod.registry = (function() {

    var registry = {
        list: []
    };

    // TODO: Оптимизировать: url → item

    registry.get_by_url = function(url) {
        return each (registry.list, function(item) {
            if (item.url === url)
                return item;
        });
    }

    registry.add = function(url) {
        let file = registry.get_by_url(url);

        if (file) {
            return file;
        } else {
            file = new ext.File(url);
            registry.list.push(file);
            mod.queue_sync.update(file);
            return file;
        }
    }

    return registry;

})();
