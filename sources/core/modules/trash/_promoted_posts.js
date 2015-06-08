(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.trash;

var trash = {}

// Продвигаемые посты (promoted posts)
trash.option_name = 'trash__promoted_posts';

trash.primary = function(){
    mod.drop('.post[data-ad]');
}

trash.for_observer = function(element){
    if (!element.classList.contains('post')) return false;

    if (element.getAttribute('data-ad') !== null)
        mod.drop(element);
}

mod.observers.push(trash);

})(kzvk);

// Ужасы. Верстальщик из ада.
//feed_row >
//    post_table >
//        post_info >
//            wall_text >
//                wall_text_name >
//                    explain >
//                        wall_text_name_explain_promoted_post
