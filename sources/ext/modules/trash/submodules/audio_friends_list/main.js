sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.audio_friends_list) {
                sub.mod.drop('.audio_friends_list_wrap');
            }
        });
    }
}

//sub.init__background = () => {}
