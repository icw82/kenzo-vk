//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
//'use strict';

if (!String.prototype.trim){
    String.prototype.trim = function(){
        return this.replace(/^\s+|\s+$/g, '');
    };
}

function getWindowParams(){
    var sizes = {};
    sizes.x = (window.pageXOffset !== undefined) ? window.pageXOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    sizes.y = (window.pageYOffset !== undefined) ? window.pageYOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
    sizes.w = ('innerWidth' in window) ? window.innerWidth :
        document.documentElement.clientWidth
    sizes.h = ('innerWidth' in window) ? window.innerHeight :
        document.documentElement.clientHeight;
    return sizes;
}

function getTimestump(){
    var time = new Date();
    return time.getTime();
}

Element.prototype.getOffset = function(){
    var boundingClientRect = this.getBoundingClientRect();

    // Для ie8 может понадобиться полифилл (лучше отдельным файлом)
    return {
        top: boundingClientRect.top + window.pageYOffset,
        left: boundingClientRect.left + window.pageXOffset,
        width: boundingClientRect.width,
        height: boundingClientRect.height
    }
};


var kenzo = {}

// Перебор массива
// Если обратная функция возвращает true, перебор прерывается.
// Если третий аргумент функция — то она выполяется последней,
//     если обратная функция ниразу не возвращала true
// Если последний элемент === true, перебор производится в обратном порядке.
kenzo.each = function(array, callback){
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

if (typeof each === 'undefined')
    var each = kenzo.each;
else
    console.warn('Переменная «each» уже занята');

kenzo.rand = function(){
    if (typeof arguments[0] == 'number'){
        if (typeof arguments[1] == 'number'){
            var
                min = arguments[0],
                max = arguments[1] + 1;

            return Math.floor( Math.random() * (max - min) ) + min;
        } else {
            if (arguments[0] < 0)
                var depth = -arguments[0];
            else
                var depth = arguments[0];

            if (depth === 0)
                return 0;

            return kenzo.rand(Math.pow(10, depth - 1), Math.pow(10, depth) - 1);
        }
    } else {
        console.warn('Неправильные аргументы');
        return false;
    }
}

kenzo.stop_event = function(event){
    event = event || window.event;
    if (!event) return false;
    while (event.originalEvent){event = event.originalEvent}
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();
    event.cancelBubble = true;
    return false;
}


// Для руского языка
kenzo.plural = function(){
    var amount, singular, paucal, plural, fr;

    if (typeof arguments[0] === 'number'){
        amount = arguments[0];
    } else if (arguments[0] instanceof Array){
        amount = arguments[0].length;
    } else if (typeof arguments[0] == 'object'){
        amount = (function(){
            var counter = 0;
            for (var j in arguments[0]) counter++;
            return counter;
        })();
    }

    if (typeof amount === 'undefined'){
        return false;
    } else if (amount < 0){
        amount = -amount;
    }

    if (
        (arguments[1] instanceof Array) &&
        (typeof arguments[1][0] == 'string') &&
        (typeof arguments[1][1] == 'string') &&
        (typeof arguments[1][2] == 'string')
    ){
        singular = arguments[1][0];
        paucal = arguments[1][1];
        plural = arguments[1][2];

    } else if (
        (typeof arguments[1] == 'string') &&
        (typeof arguments[2] == 'string') &&
        (typeof arguments[3] == 'string')
    ){
        singular = arguments[1];
        paucal = arguments[2];
        plural = arguments[3];
    } else {
        console.warn('Формы не заданы');
        return false;
    }

    (fr = amount.toString().match(/(\.\d+)/)) &&
        (amount *= Math.pow(10, fr[0].length - 1));

    if (fr !== null)
        return plural;
    if ((amount % 10 == 1) && (amount % 100 != 11))
        return singular;
    else
        if ((amount % 10 >= 2) && (amount % 10 <= 4) &&
            ((amount % 100 < 10) || (amount % 100 >= 20)))
            return paucal;
        else
            return plural;
}

kenzo.toggle_class = function(element, classes, classlist, toggle_exist){
    if (!(element instanceof Element)) return false;

    if (typeof classes === 'string') classes = [classes];
    if (!(classes instanceof Array)) return false;
    if (!(classlist instanceof Array))
        classlist = classes;

    var exist = true;

    if (toggle_exist !== false)
        toggle_exist = true;

    each (classes, function(cls){
        if (classlist.indexOf(cls) < 0)
            classlist.push(cls);
        if (!element.classList.contains(cls))
            exist = false;
    });

    each (classlist, function(cls){
        if (toggle_exist && exist) {
            element.classList.remove(cls);
        } else {
            if (classes.indexOf(cls) < 0)
                element.classList.remove(cls);
            else
                element.classList.add(cls);
        }
    });
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

