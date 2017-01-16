sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.ads_in_group)
                sub.mod.drop('#ads_in_group');
        });
    }
}

//sub.init__background = () => {}
