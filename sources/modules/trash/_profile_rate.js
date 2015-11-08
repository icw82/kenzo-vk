(function(){

var trash = {}

// Заполненность профиля
trash.option_name = 'trash__profile_rate';

trash.primary = function(){
    kk.class_forever('kz-vk-trash__profile_rate', document.querySelector('body'));
//    mod.drop('.rate_line');
//    mod.drop('.profile_rate_warning');
}

trash.for_observer = function(element){
//    if (
//        element.classList.contains('rate_line') ||
//        element.classList.contains('profile_rate_warning')
//    )
//        mod.drop(element);
}

mod.observers.push(trash);

})();
