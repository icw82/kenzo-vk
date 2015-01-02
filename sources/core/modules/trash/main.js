(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'trash',
    version: '1.0.0'
};

mod.drop = function(input){
    var _ = function(node){
        mod.dom.trash_bin.appendChild(node);
        console.info(kzvk.name, '—', mod.name, ':', node);
    };

    if (input instanceof NodeList){
        each (input, _);
    } else if (input instanceof Node){
        _(input);
    }
}

mod.init = function(){
    if (kzvk.options.trash !== true) return false;

    mod.dom = {
        body: document.querySelector('body'),
        trash_bin: document.createElement('div')
    };

    mod.dom.trash_bin.classList.add('kz-vk-trash__bin');
    mod.dom.body.insertBefore(mod.dom.trash_bin, mod.dom.body.firstChild);

    // Реклама в сайдбаре
    if (kzvk.options.trash__lsb__ad === true){
        mod.drop(document.querySelectorAll('#left_ads'));

        document.addEventListener('DOMNodeInserted', function(event){
            if (event.target instanceof Element){
                if (event.target.getAttribute('id') == 'left_ads'){
                    mod.drop(event.target);
                }
            }
        });
    }

    // Предложение друзей
    if (kzvk.options.trash__lsb__fr === true){
        mod.drop(document.querySelector('#left_friends'));

        document.addEventListener('DOMNodeInserted', function(event){
            if (event.target instanceof Element){
                if (event.target.getAttribute('id') == 'left_friends'){
                    mod.drop(event.target);
                }
            }
        });
    }

    // Популярные сообщества
    if (kzvk.options.trash__group_recom === true){
        mod.drop(document.querySelector('#group_recom_wrap'));

        document.addEventListener('DOMNodeInserted', function(event){
            if (!(event.target instanceof Element)) return false;
            if (event.target.getAttribute('id') !== 'wrap2') return false;

            mod.drop(event.target.querySelector('#group_recom_wrap'));
        });
    };

    // Реклама между постами
    if (kzvk.options.trash__newsads === true){
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

        document.addEventListener('DOMNodeInserted', function(event){
            if (!(event.target instanceof Element)) return false;
            if (event.target.getAttribute('id') !== 'wrap2') return false;

            var newsads = event.target.querySelectorAll('.ads_ads_news_wrap');
            //FIXME: говнокод
            each(newsads, function(item){
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

        });
    }

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
