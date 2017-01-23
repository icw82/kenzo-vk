sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.big_like)
                sub.mod.drop('.pv_like_fs_wrap');
        });
    }
}

//sub.init__background = () => {}
