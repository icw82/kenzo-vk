// FUTURE: вынести в KK

(function(kzvk){
'use strict';

kzvk.ancestor_search = function(descendant, class_name, distance) {
    if (typeof distance === 'number') {
        if (distance <= 0) return false;
        distance--;
    }

    if (!(descendant instanceof Element)) return false;
    if (!('parentNode' in descendant)) return false;
    if (!(descendant.parentNode instanceof Element)) return false;

    if (descendant.parentNode.classList.contains(class_name))
        return descendant.parentNode;
    else
        return this.ancestor_search(descendant.parentNode, class_name, distance);
}

})(kzvk);
