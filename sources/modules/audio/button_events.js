(function(kzvk){
'use strict';

var mod = kzvk.modules.audio;

mod.button_event = function(item, event) {
    if (event.type === 'dragstart') {
        var dt = event.dataTransfer;
        var data = 'audio/mpeg:' + item.vk_name  + '.mp3:' + item.url_clean;

        dt.setData('DownloadURL', data);
//        dt.addElement(item);
//        dt.setDragImage();

//        console.log('dt', dt);
//
        return false;
    }

    kenzo.event.stop(event);

    if (event.which === 2) {
//        console.log(chrome);
//
//        chrome.downloads.download({
//            url: item.url,
//            conflictAction: 'prompt'
//        });

        return false;
    }

    function start() {
        chrome.runtime.sendMessage({
            action: 'vk-audio__save',
            url: item.url,
            name: item.vk_name + '.mp3',
            id: item.id
        });

        //console.log('** vk-audio__save');
    }

    function stop() {
        chrome.runtime.sendMessage({
            action: 'vk-audio__stop-download',
            id: item.id
        });

        //console.log('** vk-audio__stop-download');
    }

    if (event.type === 'click') {
//        console.log(event);
//        altKey
//        ctrlKey
//        metaKey
//        shiftKey
        if (event.altKey) {
            console.log('this item:', item);
            return false;
        }

        if (item.available) {
            if ('progress' in item) {
                if (item.progress === null)
                    start();
                else
                    stop();
            } else {
                start();
            }
        } else {
            console.log('Запись недоступна');
        }
    }

}

})(kzvk);
