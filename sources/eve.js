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
                    node.localName === 'script'
                ) {
                    //console.log(node.innerHTML);

                    var matches = node.innerHTML.match(/"id":"(.+?)"/);

                    if (matches){
                        var id = matches[1];
                        console.log('eve got a ext. id (' + id + ')');

                        chrome.runtime.sendMessage(id, {eve: true}, function(){
                            console.log('***eve', arguments);
                        });

                        mo.disconnect();
                    }
                }
            });
        }
    });
});

mo.observe(document, {attributes:true, childList:true, subtree:true});

})(window);
