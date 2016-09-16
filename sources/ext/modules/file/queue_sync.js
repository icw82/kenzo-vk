mod.queue_sync = (() => {
    const _ = {};

    _.init = () => {
        ext.modules.downloads.on_storage_changed.addListener(_.sync);
    }

    _.sync = () => {
        each (mod.registry.list, _.update);
    }

    _.update = file => {
        let item = each (ext.storage.downloads.queue, item => {
            // Первая попавшаяся запись с этим URL
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

