// Реклама между постами
mod.dom_observers.push({
    option_name: 'trash__newsads',
    primary: function() {
        each ('.ads_ads_news_wrap', function(item) {
            var ancestor = kk.find_ancestor(item, 'feed_row', 2);
            if (ancestor) mod.hide(ancestor)
        });
    },
    for_observer: function(element) {
        if (element.getAttribute('id') !== 'wrap2') return false;

        each (element.querySelectorAll('.ads_ads_news_wrap'), function(item) {
            var ancestor = kk.find_ancestor(item, 'feed_row', 2);
            if (ancestor) mod.hide(ancestor)
        });
    }
});
