'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

if (typeof default_options != 'undefined'){
    if (document.readyState === 'complete'){
        chrome.storage.sync.get(default_options, function(options){
            kzvk.options = options;
            kzvk.init();
        });
    } else (function(){
        function on_load(){
            document.removeEventListener('DOMContentLoaded', on_load);
            window.removeEventListener('load', on_load);
            chrome.storage.sync.get(default_options, function(options){
                kzvk.options = options;
                kzvk.init();
            });
        }

        document.addEventListener('DOMContentLoaded', on_load, false );
        window.addEventListener('load', on_load, false );
    })();
} else {
    console.warn('default_options не загружены');
}
