(function() {

var trash = {}

// Популярные сообщества
trash.option_name = 'trash__group_recom';

trash.primary = function(){
    mod.drop('#group_recom_wrap');
}

trash.for_observer = function(element){
    if (element.getAttribute('id') !== 'wrap2') return false;
    mod.drop(element.querySelector('#group_recom_wrap'));
}

mod.observers.push(trash);

})();
