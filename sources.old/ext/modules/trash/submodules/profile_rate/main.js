// Заполненность профиля
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.potential_friends) {
                let area = ext.dom.content ? ext.dom.content : document;
                let profile_rate_warning = area.querySelector('.profile_rate_warning');
                if (profile_rate_warning)
                    sub.mod.drop(profile_rate_warning.parentNode);
            }
        });
    }
}
