// Продвигаемые посты (promoted posts)
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.promoted_posts) {
                sub.mod.drop('.post[data-ad]');
                //FUTURE: #left_box #left_holiday
            }
        });
    }
}
