(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'scrobbler',
    version: '1.0.0',
    api_key: 'dc20a585f46d025a75b0efdce8c9957a',
    secret: '110ce7f7a6cec742c6433507428ebfc7',
    get auth_url(){
        return 'http://last.fm/api/auth?api_key=' +
            this.api_key + '&cb=' +
            chrome.runtime.getURL('options/template.html');
    },
    keys: []
};

mod.init = function(){

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (sender.id !== chrome.runtime.id)
            return false;

        if (request.action === 'set audio provider key'){
            mod.keys.push(request.key);
            return false;
        }
    });

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse){
        // Существует ничтожно малая вероятность коллизии (примерно 1:(3*10^64))
        if (request.action === 'register provider'){
            each (mod.keys, function(key, i){
               if (key === request.key){
                   mod.keys[i] = kzvk.make_key();
                   sendResponse(mod.keys[i]);
                   return true;
               }
            });
        } else if (request.action === 'audio status update'){
            each (mod.keys, function(key, i){
               if (key === request.key){
                   // console.log('** info:', request.info);

               }
            });

        }
    });
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
