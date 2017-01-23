// Реклама в сайдбаре
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.sidebar_ads) {
                sub.mod.drop('#ads_left');
                sub.mod.drop('#left_ads');
                //FUTURE: #left_box #left_holiday
            }
        });
    }
}
