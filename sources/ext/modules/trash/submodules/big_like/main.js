sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.trash__big_like)
                sub.mod.drop('.pv_like_fs_wrap');
        });
    }
}

//sub.init__background = () => {}
