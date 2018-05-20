mod.init__background = () => {

//    mod.cache = new core.SimpleStore({
//        name: 'kenzo-vk',
//        version: 4,
//        store: {
//            name: 'files',
//            key: false,
//            indexes: ['basic.url', 'basic.mime', 'ts']
//        }
//    });

    mod.get().then(list => {
        mod.warn(list);
    });

}
