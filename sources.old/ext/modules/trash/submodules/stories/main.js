sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.stories) {
                sub.mod.drop('.stories_feed_wrap');
            }
        });
    }
}
