(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.button_event = function(item, event){
    kenzo.stop_event(event);

    if (event.type === 'click'){
        if (item.available){

            if (item.progress === null){
                chrome.runtime.sendMessage({
                    action: 'vk-audio__save',
                    url: item.url,
                    name: item.vk_artist + ' ' + kzvk.options.audio__separator + ' '
                        + item.vk_title + '.mp3',
                    id: item.id
                });
            } else {
                chrome.runtime.sendMessage({
                    action: 'vk-audio__stop-download',
                    id: item.id
                });
            }
        } else {
            //console.log('Запись недоступна');
        }
    }
}

})(kzvk);
