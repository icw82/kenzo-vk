(function(kzvk){
'use strict';

var mod = kzvk.modules.video;

mod.button_event = function(item, event) {

    if (event.type === 'dragstart') {
        var dt = event.dataTransfer;

        if (item.ext === 'mp4')
            var mime = 'video/mp4';
        else
            return;

        var data = mime + ':' + item.filename + ':' + item.url;

        dt.setData('DownloadURL', data);

        return;
    }

    kk.event.stop(event);

    function start(){
        chrome.runtime.sendMessage({
            action: 'vk-video__save',
            url: item.url,
            name: item.filename,
            id: item.host.id,
            format: item.format
        });

    }

    function stop(){
        chrome.runtime.sendMessage({
            action: 'vk-video__stop-download',
            id: item.host.id,
            format: item.format
        });

    }

    if (event.type === 'click'){
//        if (item.available){
            if ('progress' in item){
                if (item.progress === null)
                    start();
                else
                    stop();
            } else {
                start();
            }
//        } else {
//            mod.log('Запись недоступна');
//        }
    }
}

})(kzvk);
