// Заполненность профиля
mod.dom_observers.push({
    option_name: 'trash__profile_rate',
    primary: function() {
        kk.class_forever('kz-vk-trash__profile_rate', document.querySelector('body'));
    //    mod.drop('.rate_line');
    //    mod.drop('.profile_rate_warning');
    },
    for_observer: function(element) {
    //    if (
    //        element.classList.contains('rate_line') ||
    //        element.classList.contains('profile_rate_warning')
    //    )
    //        mod.drop(element);
    }
});
