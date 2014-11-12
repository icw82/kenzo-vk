(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
kzvk.class_forever = function(class_name, element){
    element.classList.add(class_name);

    var mo = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            if (
                (mr.attributeName == 'class') &&
                (mr.target == element) &&
                !element.classList.contains(class_name)
            ){
                element.classList.add(class_name);
            }
        });
    });

    mo.observe(element, {attributes: true /*MutationObserverInit*/});
    //mo.disconnect();
}

})(kzvk);
