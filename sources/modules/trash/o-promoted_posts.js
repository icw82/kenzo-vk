// Продвигаемые посты (promoted posts)
mod.dom_observers.push({
    option_name: 'trash__promoted_posts',
    primary: function() {
        mod.drop('.post[data-ad]');
    },
    for_observer: function(element) {

        if (element.classList.contains('feed_row')) {
            mod.drop(element.querySelectorAll('.post[data-ad]'));
            return;
        }

        if (element.getAttribute('id') === 'wrap2') {
            mod.drop(element.querySelectorAll('.post[data-ad]'));
            return;
        }
    }
});
