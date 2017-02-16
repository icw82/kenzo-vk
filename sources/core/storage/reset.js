core.storage.reset = source => new Promise((resolve, reject) => {
    const defaults = core.utils.object_to_flat(core.storage.defaults);
    browser.storage.local.set(defaults, resolve);
});
