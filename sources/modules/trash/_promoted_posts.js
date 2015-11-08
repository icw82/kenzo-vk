(function() {

var trash = {}

// Продвигаемые посты (promoted posts)
trash.option_name = 'trash__promoted_posts';

trash.primary = function(){
    mod.drop('.post[data-ad]');
}

trash.for_observer = function(element){
    var post = null;

    if (element.classList.contains('post'))
        post = element;
    else if (element.classList.contains('feed_row'))
        post = element.querySelector('.post');

    if (post && post.getAttribute('data-ad') !== null)
        mod.drop(element);

}

mod.observers.push(trash);

})();

// Ужасы. Верстальщик из ада.
//feed_row >
//    post_table >
//        post_info >
//            wall_text >
//                wall_text_name >
//                    explain >
//                        wall_text_name_explain_promoted_post
