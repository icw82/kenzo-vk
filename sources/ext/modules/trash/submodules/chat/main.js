sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.chat)
                sub.mod.drop('#chat_onl_wrap');
        });
    }
}

//sub.init__background = () => {}
