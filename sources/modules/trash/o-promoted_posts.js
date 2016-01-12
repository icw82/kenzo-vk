// Продвигаемые посты (promoted posts)
mod.dom_observers.push({
    option_name: 'trash__promoted_posts',
    primary: function() {
        mod.drop('.post[data-ad]');
    },
    for_observer: function(element) {
        var post = null;

        if (element.classList.contains('post'))
            post = element;
        else if (element.classList.contains('feed_row'))
            post = element.querySelector('.post');

        if (post && post.getAttribute('data-ad') !== null)
            mod.drop(element);
    }
});

// Ужасы. Верстальщик из ада.
//feed_row >
//    post_table >
//        post_info >
//            wall_text >
//                wall_text_name >
//                    explain >
//                        wall_text_name_explain_promoted_post
