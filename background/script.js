(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

// TODO: принять сигнал,
// TODO: начать скачивание,
// TODO: обновлять информацию о состоянии chrome.storage

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (sender.id !== chrome.runtime.id) return false;

    console.log(request);

    if (request.action === 'save'){
        chrome.downloads.download({
            url: request.url,
            filename: request.name,
            conflictAction: 'prompt'
        }, function(id){
            console.log(id);
        })
    }

})


chrome.storage.onChanged.addListener(function(changes, area_name){
    var keys = Object.keys(changes);

    if (area_name == 'local'){
        chrome.storage.local.get(function(items){
            console.log(keys);
            console.log(items);
        });
    } else if (area_name == 'sync'){
//        chrome.storage.sync.get(default_options, function(items){
//            options = items;
//        });
    }
});



//var port = chrome.runtime.connect();

//(function(){
//
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', 'https://api.vk.com/method/groups.get?user_id=170344789', true);
//    xhr.onload = function(){
//        console.log(xhr);
//    }
//
//    xhr.send(null);
//
//
//})();


})();
