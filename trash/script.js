(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

function each(array, callback){
    for (var i = 0; i < array.length; i++){
        callback(array[i]);
    }
}

function init(){
    var
        DOM_body = document.querySelector('body'),
        DOM_trash_bin = document.createElement('div'),
        DOM_trash = [
            document.querySelector('#left_ads'),
            document.querySelector('#left_friends')
        ];

    DOM_trash_bin.classList.add('kz-vk-trash__bin');
    DOM_body.appendChild(DOM_trash_bin);

    each(DOM_trash, function(item){
        (item) && ('appendChild' in item) && DOM_trash_bin.appendChild(item);
    });

    document.addEventListener('DOMNodeInserted', function(event){
        if ('classList' in event.target){
            if (event.target.getAttribute('id') == 'left_friends'){
                DOM_trash_bin.appendChild(event.target);
            }
        }
    });
}

if (document.readyState === 'complete'){
    init();
} else (function(){
    function on_load(){
        document.removeEventListener('DOMContentLoaded', on_load);
        window.removeEventListener('load', on_load);
        init();
    }

    document.addEventListener('DOMContentLoaded', on_load, false );
    window.addEventListener('load', on_load, false );
})();

/* Блок с рекомендациями тоже к херам.

<div class="feed_row">
    <div>
        <div class="ads_ads_news_wrap">
            <div class="ads_ads_news_close">
                <div class="ads_ads_news_close_tooltip tooltip_text">Это не интересно</div>
            </div>
            <div class="ads_ads_news_left">
                <a class="ads_ads_news_image" href="/apps"></a>
            </div>
            <div class="ads_ads_news_right">
                …
            </div>
        </div>
    </div>
</div>

*/

})();
