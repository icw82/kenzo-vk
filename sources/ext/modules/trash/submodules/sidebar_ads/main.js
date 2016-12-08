// Реклама в сайдбаре
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.sidebar_ads) {
                mod.drop('#ads_left');
                mod.drop('#left_ads');
                //FUTURE: #left_box #left_holiday
            }
        });
    }
}
