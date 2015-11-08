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
            mod.observe_list_item(ch.object[ch.name]);
            mod.create_button(ch.object[ch.name]);

            // Расширенная информация о файле
            mod.enrich_item(ch.object[ch.name]);

            added++;
        } else if (ch.type == 'update'){
            if (ch.name != 'length')
                mod.log('update:', ch);
        } else {
            //deleted++
            //mod.log('delete:', ch);
        }
    });

    if (added){
//        mod.log('added:', added);
//        mod.log('total:', mod.list.length);
        mod.list_clean();
    }

//    if (deleted){
//        mod.log('deleted:', deleted);
//        mod.log('total:', mod.list.length);
//    }

//    oldValue: только для типов "update" и "delete".

}

mod.observe_list = function(){
    Object.observe(mod.list, mod.list_observer);
};
