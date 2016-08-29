mod.init__background = () => {

    chrome.storage.local.get(ext.defaults, storage => {

        let options = {
            _: false,
            test: false
        }

        let o = {
            test_module: {
                options: options
            }
        }

        let flat = core.utils.object_to_flat(o);

        console.log(flat);

//        core.utils.object_to_flat();
//        core.utils.flat_to_object();

        chrome.storage.local.set(flat);
    });

    mod.on_loaded.dispatch();
}
