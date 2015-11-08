(function() {

var trash = {}

// Заполненность профиля
trash.option_name = 'trash__big_like';

trash.primary = function(){
    mod.drop('.pvs_hh');
}

trash.for_observer = function(element){
    mod.drop(element.querySelectorAll('.pvs_hh'));
}

mod.observers.push(trash);

})();
