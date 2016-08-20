const sub = new ext.SubModule(mod, 'big_like');

sub.init__content = () => {
    if (ext.mode === 2016) {
        ext.events.on_mutation.addListener(() => {
            if (ext.options.trash__big_like)
                sub.mod.drop('.pv_like_fs_wrap');
        });
    }
}

//sub.init__background = () => {}
