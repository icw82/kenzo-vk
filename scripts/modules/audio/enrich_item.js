(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.update_item = function(item, updates){
    for (var key in updates){
        item[key] = updates[key];
    }
}

mod.enrich_item = function(item){
    if (item.available){
        if (kzvk.options.audio__cache){


        } else {
            mod.get_info_from_mp3(item.url, function(update){
                mod.update_item(item, update);
                //console.log(item);
            });
        }
    }
}

})(kzvk);
