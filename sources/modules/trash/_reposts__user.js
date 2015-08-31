(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

var trash = {}

// Репосты пользователей
trash.option_name = 'trash__user_reposts';

trash.primary = function() {
    each ('.post_copy', hide);
}

trash.for_observer = function(element){
    if (!(element instanceof Element)) return false;

    if (element.classList.contains('post_copy'))
        hide(element);
    else
        each (element.querySelectorAll('.post_copy'), hide);
}

// FIXME: дублирование кода
function hide(element){
    var post_info = mod.get_post_info(element);
    if (!post_info || !post_info.repost) return false;

    if (post_info.is_group) return false;

    var ancestor = kzvk.ancestor_search(element, 'feed_row');

    if (ancestor)
        mod.hide(ancestor);
    else
        mod.hide(post_info.element, true);

    //published_sec_quote published_a_quote — второй уровень репоста?
}

mod.observers.push(trash);

})(kzvk);
