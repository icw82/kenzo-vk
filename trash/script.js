//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
(function(){

'use strict';

var options = null;

function init(items){
    options = items;

    chrome.storage.onChanged.addListener(function(a){
        chrome.storage.sync.get(default_options, function(items){
            options = items;
        });
    });

    var
        DOM_body = document.querySelector('body'),
        DOM_trash_bin = document.createElement('div');

    DOM_trash_bin.classList.add('kz-vk-trash__bin');
    DOM_body.appendChild(DOM_trash_bin);

    function drop(node){
        if (node instanceof NodeList){
            each(node, function(item){
                DOM_trash_bin.appendChild(item);
                console.log('KZVK: TRASH:', item);
            });
        } else if (node instanceof Node){
            DOM_trash_bin.appendChild(node);
            console.log('KZVK: TRASH:', node);
        }
    }

    // Реклама в сайдбаре
    if (options.trash__lsb__ad === true){
        drop(document.querySelectorAll('#left_ads'));

        document.addEventListener('DOMNodeInserted', function(event){
            if (event.target instanceof Element){
                if (event.target.getAttribute('id') == 'left_ads'){
                    drop(event.target);
                }
            }
        });
    }

    // Предложение друзей
    if (options.trash__lsb__fr === true){
        drop(document.querySelector('#left_friends'));

        document.addEventListener('DOMNodeInserted', function(event){
            if (event.target instanceof Element){
                if (event.target.getAttribute('id') == 'left_friends'){
                    drop(event.target);
                }
            }
        });
    }

    // Реклама между постами
    if (options.trash__newsads === true){
        var newsads = document.querySelectorAll('.ads_ads_news_wrap');
        //FIXME: говнокод
        each(newsads, function(item){
            if ('parentNode' in item){
                if (item.parentNode.classList.contains('feed_row')){
                    drop(item.parentNode);
                } else if ('parentNode' in item.parentNode){
                    if (item.parentNode.parentNode.classList.contains('feed_row')){
                        drop(item.parentNode.parentNode);
                    }
                }
            }
        });

        document.addEventListener('DOMNodeInserted', function(event){
            if (!(event.target instanceof Element)) return false;
            if (event.target.getAttribute('id') !== 'wrap2') return false;

            var newsads = event.target.querySelectorAll('.ads_ads_news_wrap');
            //FIXME: говнокод
            each(newsads, function(item){
                if ('parentNode' in item){
                    if (item.parentNode.classList.contains('feed_row')){
                        drop(item.parentNode);
                    } else if ('parentNode' in item.parentNode){
                        if (item.parentNode.parentNode.classList.contains('feed_row')){
                            drop(item.parentNode.parentNode);
                        }
                    }
                }
            });

        });
    }
}

if (document.readyState === 'complete'){
    chrome.storage.sync.get(default_options, function(items){
        init(items);
    });
} else (function(){
    function on_load(){
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        chrome.storage.sync.get(default_options, function(items){
            init(items);
        });
    }

    document.addEventListener('DOMContentLoaded', on_load, false );
    window.addEventListener('load', on_load, false );
})();

})();
