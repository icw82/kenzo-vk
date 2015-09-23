(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

mod.hide = function(input, hard) {
    if (hard) {
        var _ = function(node) {
            node.style.height = 0;
            node.style.margin = 0;
            node.style.padding = 0;
            node.style.border = 'none';
            node.style.overflow = 'hidden';

            mod.log('hard hide', node);
        }
    } else {
        var _ = function(node) {
            node.classList.add('kz-vk-trash__hidden-shit');
            mod.log('hide', node);
        }
    }

    if (typeof input == 'string')
        each (document.querySelectorAll(input), _);
    else if (input instanceof NodeList)
        each (input, _);
    else if (input instanceof Node)
        _(input);
}

})(kzvk);
