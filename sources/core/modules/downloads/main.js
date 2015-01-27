(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'downloads',
    version: '1.0.0'
};

mod.add_to_current = function(download_id, type, id, format){
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
    //console.log('downloads_listner:', delta);

    if (delta.filename){
        mod.watch.start();
    } else if (delta.endTime){
        console.log('Download complete', delta.id);
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

    kzvk.options.debug && request.name && console.log('source:', request.name);

    if (typeof request.name === 'string'){
        request.name = request.name.replace(/[\\\/:\*\?<>\|\"]*/g, '');

        if (kzvk.options.filters__square_brackets === true){
            request.name = request.name.replace(/\[.+?\]/g, '');
        }

        if (kzvk.options.filters__curly_brackets === true){
            request.name = request.name.replace(/\{.+?\}/g, '');
        }

        request.name = request.name.trim();
        request.name = request.name.replace(/\s+/g, ' ');
        request.name = request.name.replace(/\s(\.\w+?)$/g, '$1');

        if (request.name.length === 0){
            request.name = chrome.i18n.getMessage('mistake');
        }
    }

    kzvk.options.debug && request.name && console.log('filtered:', request.name);

    if (request.action === 'vk-audio__save'){ // AUDIO
        chrome.downloads.download({
            url: request.url,
            filename: request.name,
            conflictAction: 'prompt'
        }, function(download_id){
            mod.add_to_current(download_id, 'vk-audio', request.id);
        });
    } else if (request.action === 'vk-audio__stop-download'){
        chrome.storage.local.get('downloads', function(data){
            each (data.downloads.current, function(item){
                if (request.id === item.id&& item.type === 'vk-audio'){
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

mod.init = function(){
//    chrome.downloads.onCreated.addListener(function(item){
//        console.log('onCreated', item);
//    })
//
//    chrome.downloads.onErased.addListener(function(item){
//        console.log('onErased', item);
//    })

    mod.watch.start();

    chrome.downloads.onChanged.addListener(mod.downloads_listner);

    chrome.runtime.onMessage.addListener(mod.message_listner);

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
