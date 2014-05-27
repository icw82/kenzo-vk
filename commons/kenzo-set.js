//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict';

function each(array, callback){
    for (var i = 0; i < array.length; i++){
        callback(array[i]);
    }
}

var kzCurrentlyPressedKeys = [];

window.addEventListener('keydown', function(event){
    var pos = kzCurrentlyPressedKeys.indexOf(event.keyCode);

    if (pos === -1)
        kzCurrentlyPressedKeys.push(event.keyCode);
});

window.addEventListener('keyup', function(event){
    var pos = kzCurrentlyPressedKeys.indexOf(event.keyCode);

    if (pos > -1)
        kzCurrentlyPressedKeys.splice(pos, 1);
});
