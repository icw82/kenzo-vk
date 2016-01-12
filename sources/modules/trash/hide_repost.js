// todo проверить
mod.hide_repost = function(element, for_group) {
    var post_info = mod.get_post_info(element);
    if (!post_info || !post_info.repost) return;

    if (!for_group && post_info.is_group) return;
    if (for_group && !post_info.is_group) return;

    var ancestor = kk.find_ancestor(element, 'feed_row');

    if (ancestor)
        mod.hide(ancestor);
    else
        mod.hide(post_info.element, for_group ? false : true); // NOTE: Что это за хрень?

    //published_sec_quote published_a_quote — второй уровень репоста?
}

mod.hide_user_repost = function(element) {
    return mod.hide_repost(element, false);
}

mod.hide_group_repost = function(element) {
    return mod.hide_repost(element, false);
}
