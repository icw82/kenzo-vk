(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.button_event = function(item, event){
    kenzo.stop_event(event);


    function start(){
        chrome.runtime.sendMessage({
            action: 'vk-audio__save',
            url: item.url,
            name: item.vk_artist + ' ' + kzvk.options.audio__separator + ' '
                + item.vk_title + '.mp3',
            id: item.id
        });

        console.log('** vk-audio__save');
    }

    function stop(){
        chrome.runtime.sendMessage({
            action: 'vk-audio__stop-download',
            id: item.id
        });

        console.log('** vk-audio__stop-download');
    }

    if (event.type === 'click'){
        if (item.available){
            if ('progress' in item){
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
