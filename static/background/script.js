(function(){

//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

// default_globals — подкючается отдельным файлом.

var options = {};

function ids_add(download_id, vk_audio_id){
    chrome.storage.local.get(default_globals, function(storage){
        storage.downloads.ids.push({
            vk: vk_audio_id, // идентификатор аудиозаписи
            download: download_id // идентификатор загрузки
        });

        chrome.storage.local.set(storage);
    });
}

function message_listner(request, sender, sendResponse){
    if (sender.id !== chrome.runtime.id) return false;

    if (request.action === 'save-vk-audio'){
        request.name = request.name.replace(/[\\\/:\*\?<>\|]*/g, '');

        chrome.downloads.download({
            url: request.url,
            filename: request.name,
            conflictAction: 'prompt'
        }, function(download_id){
            ids_add(download_id, request.vk.id);
        });
    }
}

function storage_listner(changes, area_name){
    var keys = Object.keys(changes);

    if (area_name == 'local'){
        chrome.storage.local.get(function(items){
            console.log('> Storage changed', keys, items);
        });
    } else if (area_name == 'sync'){
        chrome.storage.sync.get(function(items){
            options = items;
        });
    }
}

function downloads_listner(delta){
    //console.log('downloads_listner:', delta);

    if (delta.filename)
        watch_downloads.start();

    else if (delta.endTime){
        console.log('download complete', delta.id);
    }

    else if (delta.paused)
        if (delta.paused.current)
            console.log('Paused');
        else
            console.log('Resume');
}

var watch_downloads = (function(){
    var id = null,
        interval = 1000,
        _ = {};

    function update_2(downloads){
        chrome.storage.local.get(default_globals, function(storage){

            var progress_list = [];

            each (downloads, function(d_item){
                each (storage.downloads.ids, function(rels){
                    if (rels.download === d_item.id){
                        progress_list.push({
                            id: rels.vk,
                            done: Math.floor(d_item.bytesReceived / d_item.totalBytes * 100)
                        });
                    }
                });
            });

            storage.downloads.progress = progress_list;
            chrome.storage.local.set(storage);

            console.log('update_2')

            if (progress_list.length === 0)
                stop();
        });
    }

    function update(){
        chrome.downloads.search({
            state: 'in_progress'
        }, function(items){
            if (items.length <= 0){
                stop();
                return false;
            }

            update_2(items);
        })

    }

    function stop(){
        chrome.storage.local.get(function(storage){
            storage.downloads.progress = [];
            chrome.storage.local.set(storage);
        });

        clearInterval(id);
        id = null;
        console.log('watch complete');
    }

    _.start = function(){
        if (id !== null) return false;

        id = setInterval(update, interval);

        return true;
    }


    return _;
})();


chrome.storage.sync.get(function(items){
    options = items;
});

chrome.storage.local.get(function(items){
    console.log('> Storage:', items);
});

watch_downloads.start();

chrome.runtime.onMessage.addListener(message_listner);

chrome.storage.onChanged.addListener(storage_listner);

chrome.downloads.onChanged.addListener(downloads_listner);


// TODO: удаление связки ids при окончании закачки файла
// TODO: очередь закачки
// TODO: история закачек

//(function(){
//
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', 'https://api.vk.com/method/groups.get?user_id=170344789', true);
//    xhr.onload = function(){
//        console.log(xhr);
//    }
//
//    xhr.send(null);
//})();

})();
