core.storage.load = source => new Promise((resolve, reject) => {
    const defaults = core.utils.object_to_flat(core.storage.defaults);
    chrome.storage.local.get(defaults, storage => {
        core.storage.map = storage;
        core.storage.data = core.utils.flat_to_object(core.storage.map);
        resolve();
    });
});
