(function(kzvk) {
'use strict';

var mod = kzvk.modules.downloads;

mod.init.background = function() {
    chrome.downloads.onCreated.addListener(function(item){
        //var id = item.id;
        console.log('downloads.onCreated', item);
    })

//    chrome.downloads.onErased.addListener(function(item){
//        var id = item.id;
//        console.log('onErased', item);
//    })

    mod.watch.start();

    chrome.downloads.onChanged.addListener(mod.downloads_listner);

    chrome.runtime.onMessage.addListener(mod.message_listner);
}

})(kzvk);
