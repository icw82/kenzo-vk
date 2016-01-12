// Репосты пользователей
mod.dom_observers.push({
    option_name: 'trash__group_reposts',
    primary: function() {
        each ('.post_copy', mod.hide_group_repost);
    },
    for_observer: function(element) {
        if (!(element instanceof Element)) return false;

        if (element.classList.contains('post_copy'))
            mod.hide_group_repost(element);
        else
            each (element.querySelectorAll('.post_copy'), mod.hide_group_repost);
    }
});
