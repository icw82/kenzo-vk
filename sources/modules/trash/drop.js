(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

mod.drop = function(input, option){
    var _ = function(node) {
        kzvk.dom.trash_bin.appendChild(node);
        node.style.height = '0px';
        console.info(kzvk.name + ' — ' + mod.name + ' (drop):', node);
    }

    if (typeof input == 'string'){
        each (document.querySelectorAll(input), _);
    } else if (input instanceof NodeList){
        each (input, _);
    } else if (input instanceof Node){
        _(input);
    }
}

})(kzvk);
