sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.audio_friends_list) {
                each ('.audio_friends_list', target => {
                    let block = kk.find_ancestor(target, '._audio_additional_blocks_wrap');
                    sub.mod.drop(block);
                });
            }
        });
    }
}

//sub.init__background = () => {}
