(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.list_update__downloads = function(updates){
    each (mod.list, function(item){
        each (updates, function(update){
            if ((item.id === update.id) && (update.type === 'vk-audio')){
                //console.log('**', item);
                item.progress = update.progress;
                return true;
            }
        }, function(){
            item.progress = null;
        });
    });
}

mod.observe_progress = function(){
    function observer(changes, areaName){
//        if (areaName == 'local')
//            console.log('changes', changes)

        if ((areaName == 'local') && ('downloads' in changes)){
            var updates = changes.downloads.newValue.current;
            mod.list_update__downloads(updates);
        }
    }

    if (kzvk.options.audio__progress_bars){
        chrome.storage.local.get('downloads', function(storage){
            mod.list_update__downloads(storage.downloads.current);
        });

        chrome.storage.onChanged.addListener(observer);
    }
}

})(kzvk);
