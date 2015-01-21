(function(root){

var each = function(array, callback){
    if (typeof array === 'string')
        array = document.querySelectorAll(array);
    else if (typeof array === 'number')
        array = Array(array);

    if (typeof arguments[2] === 'function'){
        var def = arguments[2];
        if (arguments[3] === true)
            var reverse = true;
    } else if (arguments[2] === true){
        var reverse = true;
    }

    if (
        (typeof array === 'object') && (array !== null) && ('length' in array) &&
        (typeof callback === 'function')
    ){
        var nothing = true;
        if (reverse) {
            for (var i = array.length - 1; i >= 0; i--){
                if (callback(array[i], i) === true){
                    nothing = false;
                    break;
                }
            }
        } else {
            for (var i = 0; i < array.length; i++){
                if (callback(array[i], i) === true){
                    nothing = false;
                    break;
                }
            }
        }

        if (nothing && (typeof def === 'function')) {
            def();
        }
    };
}

var mo = new MutationObserver(function(mutations){
    each (mutations, function(mr){
        if (mr.type === 'childList'){
            each (mr.addedNodes, function(node){

                if (
                    node.id === 'kenzo-vk__provider-audio' &&
                    node.nodeType === 1 &&
                    node.localName === 'script'
                ) {
                    var tag = document.body.querySelector('#kenzo-vk__provider-audio');
                    if (!tag) return false;
                    var id = tag.getAttribute('data-ext-id');
                    var pub = tag.getAttribute('data-pub-key');

                    console.log('eve got a key (' + pub + ') and ext. id (' + id + ')');

                    mo.disconnect();
                }
            });
        }
    });
});

mo.observe(document, {attributes:true, childList:true, subtree:true});

})(window);
