mod.button_event = function(item, event) {
    if (event.type === 'dragstart') {
        var dt = event.dataTransfer;
        var data = 'audio/mpeg:' + item.vk_name  + '.mp3:' + item.url_clean;

        dt.setData('DownloadURL', data);
//        dt.addElement(item);
//        dt.setDragImage();

//        mod.log('dt', dt);
//
        return false;
    }

    kk.event.stop(event);

    if (event.which === 2) {
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

        mod.log('save');
    }

    function stop() {
        chrome.runtime.sendMessage({
            action: 'vk-audio__stop-download',
            id: item.id
        });

        mod.log('stop-download');
    }

    if (event.type === 'click') {
//        mod.log(event);
//        altKey
//        ctrlKey
//        metaKey
//        shiftKey
        if (event.altKey) {
            mod.log('this item:', item);
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
            mod.log('Запись недоступна');
        }
    }

}
