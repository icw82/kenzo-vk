mod.list_update__downloads = function(updates) {
    each (mod.registry.list, function(item) {
        each (item.formats, function(button) {
            each (updates, function(update) {
                if (
                    button.host.id === update.id &&
                    button.format === update.format &&
                    update.type === 'vk-video'
                ) {
                    button.progress = update.progress;
                    return true;
                }
            }, function() {
                button.progress = null;
            });
        });
    });
}

mod.observe_downloads = function() {
    function observer(changes, areaName) {
        if ((areaName == 'local') && ('downloads' in changes)) {
            var updates = changes.downloads.newValue.current;
            mod.list_update__downloads(updates);
        }
    }

    if (mod.options.progress_bars) {
        chrome.storage.local.get('downloads', function(storage) {
            mod.list_update__downloads(storage.downloads.current);
        });

        chrome.storage.onChanged.addListener(observer);
    }
}
