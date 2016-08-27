// Реклама в сайдбаре
const sub = new ext.SubModule(mod, 'sidebar_ads');

sub.init__content = () => {
    if (ext.mode === 2016) {
        ext.events.on_mutation.addListener(() => {
            if (ext.options.trash && ext.options.trash__sidebar_ads) {
                mod.drop('#ads_left');
                mod.drop('#left_ads');
                //FUTURE: #left_box #left_holiday
            }
        });
    }
}
