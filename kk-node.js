'use strict';

var path = require('path');
var kenzo = {};

// Перебор массива
// если обратная функция возвращает true, перебор прерывается.
kenzo.each = function(array, callback, def) {
    if (typeof array === 'string')
        return; //array = document.querySelectorAll(array);
    else if (typeof array === 'number')
        array = Array(array);

    if (
        (typeof array === 'object') && (array !== null) && ('length' in array) &&
        (typeof callback === 'function')
    ) {
        var nothing = true;
        for (var i = 0; i < array.length; i++) {
            if (callback(array[i], i) === true) {
                nothing = false;
                break;
            }
        }

        if (nothing && (typeof def === 'function')) {
            def();
        }
    };
}

kenzo.path = {}

kenzo.path.convert = function(p) {
    if (path.sep === '\\')
        return p.replace(/\\/g, '/');
    else
        return p;
};

kenzo.path.relative = function(original, root) {
    if (typeof original == 'string') {
        return path.relative(root, original);

    } else {
        var _ = {};

        for (var key in original) {
            _[key] = path.relative(root, original[key]);
        }

        return _;
    }
}

module.exports = kenzo;
