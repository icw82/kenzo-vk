(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

var trash = {}

// Репосты пользователей
trash.option_name = 'trash__group_reposts';

trash.primary = function() {
    each ('.post_copy', mod.hide_group_repost);
}

trash.for_observer = function(element){
    if (!(element instanceof Element)) return false;

    if (element.classList.contains('post_copy'))
        mod.hide_group_repost(element);
    else
        each (element.querySelectorAll('.post_copy'), mod.hide_group_repost);
}

mod.observers.push(trash);

})(kzvk);
