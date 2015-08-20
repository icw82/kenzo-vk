(function(kzvk){
'use strict';

var mod = kzvk.modules.audio;

// Отлов изменений объекта аудизаписи в списке
mod.item_observer = function(changes){
    var goals = []; // Изменённые объекты [{item, changes}, {…}]

    each (changes, function(ch){
        each (goals, function(goal){
            if (goal.item === ch.object){
                if (goal.changes.indexOf(ch.name) === -1)
                    goal.changes.push(ch.name);
                return true;
            }
        }, function(){
            goals.push({
                item: ch.object,
                changes: [ch.name]
            });
        }, true);
    });

    if (goals.length > 0){
        each (goals, function(goal){
            mod.update_button(goal.item, goal.changes);
        });
    }
}

mod.observe_list_item = function(item){
    Object.observe(item, mod.item_observer);
};

})(kzvk);
