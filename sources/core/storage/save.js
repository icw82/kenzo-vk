core.storage.save = source => new Promise((resolve, reject) => {
    core.storage.map = core.utils.object_to_flat(core.storage.data);
//    console.log('— core.storage.save', source, core.storage.map);
//    console.log('→ ', core.storage.map['audio.options._']);
    chrome.storage.local.set(core.storage.map, () => resolve());
});
