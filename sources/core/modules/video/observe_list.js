(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.video;

mod.list_clean = function(){
    // Очистка списка
    mod.list = mod.list.filter(function(item){
        return document.body.contains(item.dom_element);
    });

    // Перезапуск наблюдателя (т. к. предыдущий объект уничтожен)
    mod.observe_list();
}

// Отлов изменений списка аудиозаписей
mod.list_observer = function(changes){
    var added = 0,
        deleted = 0;

    each (changes, function(ch){
        if (ch.type == 'add'){

            each (ch.object[ch.name].formats, function(format){
                mod.observe_list_item_formats(format);
            });

            mod.create_buttons(ch.object[ch.name]);

            added++;
        } else if (ch.type == 'update'){
//            if (ch.name != 'length')
//                console.log('** update:', ch);
        } else {
            //deleted++
            //console.log('**** delete:', ch);
        }
    });

    if (added){
//        console.log('added:', added);
//        console.log('total:', mod.list.length);
        mod.list_clean();
    }
}

mod.observe_list = function(){
    Object.observe(mod.list, function(changes){
        try { // FIXME: временно для отлова ошибок внутри Object.observe();
            mod.list_observer(changes);
        } catch (error) {
            console.error(error);
        }
    });
};

})(kzvk);
