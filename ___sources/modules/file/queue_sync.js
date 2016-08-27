mod.queue_sync = (function() {
    const _ = {};

    _.queue = [];

    _.init = function() {
        chrome.storage.local.get('downloads', function(storage) {
            _.queue = storage.downloads;
            _.sync();
        });

        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if ((areaName == 'local') && ('downloads' in changes)) {
                _.queue = changes.downloads.newValue;
                _.sync();
            }
        });
    }

    _.sync = function() {
        each (mod.registry.list, _.update);
    }

    _.update = function(file) {
        let q = each (_.queue, function(q) {
            // Первая попавшаяся запись с этим URL
            if (q.url === file.clean_url) {
                return q;
            }
        });

        if (q) {
            file.state = q.state;
            file.queue_id = q.id;
            file.progress = q.progress;
        } else {
            file.state = 0;
            file.queue_id = false;
        }
    }

    return _;

})();

