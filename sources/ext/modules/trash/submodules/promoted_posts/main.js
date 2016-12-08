// Продвигаемые посты (promoted posts)
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.promoted_posts) {
                mod.drop('.post[data-ad]');
                //FUTURE: #left_box #left_holiday
            }
        });
    }
}
