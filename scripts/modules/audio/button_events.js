(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.button_event = function(item, event){
    kenzo.stop_event(event);

    if (event.type === 'click'){
        if (item.available){
            chrome.runtime.sendMessage({
                action: 'save-vk-audio',
                url: item.url,
                name: item.vk_artist + ' ' + kzvk.options.audio__separator + ' '
                    + item.vk_title + '.mp3'
            });

            console.log('Отправлено в загрузки');
        } else {
            console.log('Запись недоступна');
        }
    }
}

})(kzvk);
