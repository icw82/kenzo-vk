(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

var trash = {}

// Реклама в сайдбаре
trash.option_name = 'trash__lsb__ad';

trash.primary = function(){
    mod.drop('#left_ads');

    //FUTURE: #left_box #left_holiday
}

trash.for_observer = function(element){
    if (element.getAttribute('id') == 'left_ads'){
        mod.drop(element);
    }
}

mod.observers.push(trash);

})(kzvk);
