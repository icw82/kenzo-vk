(function(kzvk){
'use strict';

var mod = {
    name: 'downloads',
    version: '1.0.0'
};

mod.add_to_current = function(download_id, type, id, format){

    //console.log('**add_to_current:', arguments);

    chrome.storage.local.get('downloads', function(data){
        data.downloads.current.push({
            download_id: download_id, // идентификатор загрузки
            type: type, // тип загружаемого файла
            id: id, // идентификатор vk
            format: format, // формат (видеозаписи)
            progress: 0
        });

        chrome.storage.local.set({
            'downloads': {
                'current': data.downloads.current
            }
        }, mod.watch.start);
    });
}

mod.downloads_listner = function(delta){
    var id = delta.id;

    //console.log('downloads_listner:', delta);

    if (delta.filename){
        mod.watch.start();
    } else if (delta.endTime){
        console.log('Download complete', id);
    } else if (delta.paused){
        if (delta.paused.current)
            console.log('Paused');
        else
            console.log('Resume');
    }
}

mod.message_listner = function(request, sender, sendResponse){
    if (sender.id !== chrome.runtime.id)
        return false;

    request.name = kzvk.name_filter(request.name);

    if (request.action === 'vk-audio__save'){ // AUDIO
        chrome.downloads.download({
            url: request.url,
            filename: request.name,
            conflictAction: 'prompt'
        }, function(download_id){
            mod.add_to_current(download_id, 'vk-audio', request.id);
        });
    } else if (request.action === 'vk-audio__stop-download') {
        chrome.storage.local.get('downloads', function(data) {
            each (data.downloads.current, function(item){
                if (request.id === item.id && item.type === 'vk-audio'){
                    chrome.downloads.cancel(item.download_id);
                    return true;
                }
            });
        });
    } else if (request.action === 'vk-video__save'){ // VIDEO
        chrome.downloads.download({
            url: request.url,
            filename: request.name,
            conflictAction: 'prompt'
        }, function(download_id){
            mod.add_to_current(download_id, 'vk-video', request.id, request.format);
        });
    } else if (request.action === 'vk-video__stop-download'){
        chrome.storage.local.get('downloads', function(data){
            each (data.downloads.current, function(item){
                if (
                    request.id === item.id &&
                    request.format === item.format &&
                    item.type === 'vk-video'
                ){
                    chrome.downloads.cancel(item.download_id);
                    return true;
                }
            });
        });
    }
}

mod.init = function(scope) {
    if (typeof scope !== 'string') return;

    if (scope === 'background') {
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

        return true;
    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
