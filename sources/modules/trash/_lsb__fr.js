(function() {

var trash = {}

// Предложение друзей
trash.option_name = 'trash__lsb__fr';

trash.primary = function(){
    mod.drop('#left_friends');
}

trash.for_observer = function(element){
    if (element.getAttribute('id') == 'left_friends'){
        mod.drop(element);
    }
}

mod.observers.push(trash);

})();
