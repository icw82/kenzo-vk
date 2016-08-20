// Репосты пользователей
const sub = new ext.SubModule(mod, 'reposts');

// TODO: Обновить
//mod.dom_observers.push({
//    option_name: 'trash__group_reposts',
//    on_content_load: function() {
//        each ('.post_copy', mod.hide_group_repost);
//    },
//    for_observer: function(element) {
//        if (!(element instanceof Element)) return false;
//
//        if (element.classList.contains('post_copy'))
//            mod.hide_group_repost(element);
//        else
//            each (element.querySelectorAll('.post_copy'), mod.hide_group_repost);
//    }
//});

// Репосты пользователей
// TODO: Обновить
//mod.dom_observers.push({
//    option_name: 'trash__user_reposts',
//    on_content_load: function() {
//        each ('.post_copy', mod.hide_user_repost);
//    },
//    for_observer: function(element) {
//        if (!(element instanceof Element)) return false;
//
//        if (element.classList.contains('post_copy'))
//            mod.hide_user_repost(element);
//        else
//            each (element.querySelectorAll('.post_copy'), mod.hide_user_repost);
//    }
//});

//mod.hide_repost = function(element, for_group) {
//
//    var post_info = mod.get_post_info(element);
//    if (!post_info || !post_info.repost) return;
//
//    if (!for_group && post_info.is_group) return;
//    if (for_group && !post_info.is_group) return;
//
//    var ancestor = kk.find_ancestor(element, 'feed_row');
//
//    if (ancestor)
//        mod.hide(ancestor);
//    else
//        mod.hide(post_info.element, for_group ? false : true); // NOTE: Что это за хрень?
//
//    //published_sec_quote published_a_quote — второй уровень репоста?
//
//}
//
//mod.hide_user_repost = function(element) {
//    return mod.hide_repost(element, false);
//}
//
//mod.hide_group_repost = function(element) {
//    return mod.hide_repost(element, false);
//}



//mod.parse_post = function(matches) {
//    var _ = {};
//
//    _.author_id = matches[1];
//    _.post_id = matches[2];
//
//    if (_.author_id[0] === '-') {
//        _.author_id = _.author_id.slice(1);
//        _.is_group = true;
//    } else {
//        _.is_group = false;
//    }
//
//    return _;
//}
//
//mod.get_post_info = function(element) {
//
//    if (!(element instanceof Element) || !element.classList.contains('post')) {
//        mod.warn('Не пост', element);
//        return false;
//    }
//
//    var element_id = element.getAttribute('id');
//    var matches = element_id.match(/^post(.+?)_(.+)/);
//
//    var _ = mod.parse_post(matches);
//
//    var copy = element.getAttribute('data-copy');
//
//    if (copy) {
//        _.is_repost = true;
//
//        matches = copy.match(/(.+?)_(.+)/);
//
//        _.repost = mod.parse_post(matches);
//    } else {
//        _.is_repost = false;
//    }
//
//    _.element = element;
//
//    return _;
//}

