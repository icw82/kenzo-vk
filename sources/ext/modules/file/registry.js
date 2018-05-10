// Реестр используемых на странице файлов (класс File)
mod.registry = (() => {
    const registry = {
        list: []
    };

    // TODO: Оптимизировать: url → item

    registry.get_by_url = url => {
        return each (registry.list, function(item) {
            if (item.url === url)
                return item;
        });
    }

    registry.add = url => {
        let file = registry.get_by_url(url);

        if (file) {
            return file;
        } else {
            file = new ext.File(url);
            registry.list.push(file);
            mod.synchronizeQueue.update(file);
            return file;
        }
    }

    return registry;

})();
