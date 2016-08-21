// Заполненность профиля
const sub = new ext.SubModule(mod, 'profile_rate');

sub.init__content = () => {
    if (ext.mode === 2016) {
        ext.events.on_mutation.addListener(() => {
            if (ext.options.trash__potential_friends) {
                let area = ext.dom.content ? ext.dom.content : document;
                let profile_rate_warning = area.querySelector('.profile_rate_warning');
                if (profile_rate_warning)
                    mod.drop(profile_rate_warning.parentNode);
            }
        });
    }
}
