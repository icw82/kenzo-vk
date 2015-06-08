(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.trash;

var trash = {}

// Реклама между постами
trash.option_name = 'trash__newsads';

trash.primary = function(){
    var newsads = document.querySelectorAll('.ads_ads_news_wrap');
    //FIXME: говнокод
    each (newsads, function(item){
        if ('parentNode' in item){
            if (item.parentNode.classList.contains('feed_row')){
                mod.drop(item.parentNode);
            } else if ('parentNode' in item.parentNode){
                if (item.parentNode.parentNode.classList.contains('feed_row')){
                    mod.drop(item.parentNode.parentNode);
                }
            }
        }
    });
}

trash.for_observer = function(element){
    if (element.getAttribute('id') !== 'wrap2') return false;

    var newsads = element.querySelectorAll('.ads_ads_news_wrap');
    //FIXME: говнокод
    each (newsads, function(item){
        if ('parentNode' in item){
            if (item.parentNode.classList.contains('feed_row')){
                mod.drop(item.parentNode);
            } else if ('parentNode' in item.parentNode){
                if (item.parentNode.parentNode.classList.contains('feed_row')){
                    mod.drop(item.parentNode.parentNode);
                }
            }
        }
    });
}

mod.observers.push(trash);

})(kzvk);
