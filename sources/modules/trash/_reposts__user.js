(function(){

var trash = {}

// Репосты пользователей
trash.option_name = 'trash__user_reposts';

trash.primary = function() {
    each ('.post_copy', mod.hide_user_repost);
}

trash.for_observer = function(element){
    if (!(element instanceof Element)) return false;

    if (element.classList.contains('post_copy'))
        mod.hide_user_repost(element);
    else
        each (element.querySelectorAll('.post_copy'), mod.hide_user_repost);
}

mod.observers.push(trash);

})();
