(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

function init(){
    var
        DOM_body = document.querySelector('body'),
        DOM_trash = document.createElement('div'),
        DOM_left_ads = document.querySelector('#left_ads');

    DOM_trash.classList.add('kz-trash');
    DOM_body.appendChild(DOM_trash);
    DOM_trash.appendChild(DOM_left_ads);
/*
    document.addEventListener('DOMNodeInserted', function(event){
        console.log(event.target);
    })
*/

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

})();
