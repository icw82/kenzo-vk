(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

var trash = {}

// Реклама между постами
trash.option_name = 'trash__newsads';

trash.primary = function() {
    each ('.ads_ads_news_wrap', function(item) {
        var ancestor = kzvk.ancestor_search(item, 'feed_row', 2);
        if (ancestor) mod.hide(ancestor)
    });
}

trash.for_observer = function(element) {
    if (element.getAttribute('id') !== 'wrap2') return false;

    each (element.querySelectorAll('.ads_ads_news_wrap'), function(item) {
        var ancestor = kzvk.ancestor_search(item, 'feed_row', 2);
        if (ancestor) mod.hide(ancestor)
    });
}

mod.observers.push(trash);

})(kzvk);
