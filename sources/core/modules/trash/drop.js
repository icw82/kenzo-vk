(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.trash;

mod.drop = function(input){
    var _ = function(node){
        mod.dom.trash_bin.appendChild(node);
        console.info(kzvk.name + ' — ' + mod.name + ':', node);
    };

    if (typeof input == 'string'){
        each (document.querySelectorAll(input), _);
    } else if (input instanceof NodeList){
        each (input, _);
    } else if (input instanceof Node){
        _(input);
    }
}

})(kzvk);
