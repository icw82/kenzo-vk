(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

kzvk.get_buffer = function(/* String url [, Array range], Function callback */){
    // Проверка
    if (typeof arguments[0] !== 'string'){
        console.warn('KZ: url не передан');
        return false;
    } else
        var url = arguments[0];

    if (arguments[1]){
        if (typeof arguments[1] == 'function'){
            var callback = arguments[1];
        } else if (arguments[1] instanceof Array){
            if (arguments[1][0] instanceof Array)
                var ranges = arguments[1];
            else
                var ranges = [arguments[1]];

            if (typeof arguments[2] == 'function')
                var callback = arguments[2];
            else {
                console.warn('KZ: Функция обратного вызова не передана');
                return false;
            }
        } else {
            console.warn('KZ: Второй аргумент не передан');
            return false;
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    if (!ranges) {
    // Передача файла полностью

    } else if (ranges.length === 1){
    // Передача файла одной части файла
        xhr.setRequestHeader('Range', 'bytes=' + ranges[0][0] + '-' + ranges[0][1]);

        xhr.onreadystatechange = function(){
            if (xhr.readyState !== 4) return false;
            if (xhr.status === 206){
                var self = this;
                callback([{
                    'headers': self.getAllResponseHeaders(),
                    'getHeader': function(header){
                        return self.getResponseHeader(header);
                    },
                    'content': self.response
                }]);
            } else {
                callback(false);
            }
        }

    } else {
    // Передача файла нескольких частей файла
        xhr.setRequestHeader('Range', 'bytes=' + (function(){
            ranges.forEach(function(element, index){
                ranges[index] = ranges[index][0] + '-' + ranges[index][1];
            })
            return ranges.join(',');
        })());

        xhr.onreadystatechange = function(){
            if (xhr.readyState !== 4) return false;
            if (xhr.status === 206){

                // Разделитель
                var separator = (function(range){
                    var out = range.match(/boundary=(.+)$/);
                    if (out && out[1])
                        return out[1];
                    else
                        return false;
                })(this.getResponseHeader('Content-Type'));

                // Части
                var parts = (function(response, separator){
                    var
                        ranges = [],
                        view = new Uint8Array(response),
                        out = [],
                        cur = 0;
// — — — — — — — — — — — — — — — indian Magic (рождённое в муках и бреду)
// Поиск начала данных раздела
while (cur < response.byteLength){
    if (view[cur] === 45 && view[cur + 1] === 45){
        cur += 2;
        for (var i = 0; i < separator.length; i++){
            if (separator.charCodeAt(i) === view[cur]){
                if (i == separator.length - 1){
                    cur++;
                    if (view[cur] === 13 && view[cur + 1] === 10){
                        cur += 2;
                        if (ranges.length > 0){
                            ranges[ranges.length - 1].end = cur - separator.length - 7;
                        }

                        ranges.push({headers: cur});

                        while (
                            cur < response.byteLength &&
                            !(view[cur + 2] === 45 && view[cur + 3] === 45)
                        ){
                            if (
                                view[cur] === 13 && view[cur + 1] === 10 &&
                                view[cur + 2] === 13 && view[cur + 3] === 10
                            ){
                                cur += 4;
                                break;
                            } else {
                                cur++;
                            }
                        }

                        if (cur !== response.byteLength - 1)
                            ranges[ranges.length - 1].begin = cur;

                    } else if (view[cur] === 45 && view[cur + 1] === 45){
                        ranges[ranges.length - 1].end = cur - separator.length - 5;
                    }
                }
            } else {
                break;
            }

            cur++;
        }
    } else {
        cur++;
    }
}
// — — — — — — — — — — — — — — —
                    for (var i = 0; i < ranges.length; i++){
                        var headers = '',
                            headers_array = new Uint8Array(
                                response,
                                ranges[i].headers,
                                ranges[i].begin - 4 - ranges[i].headers
                            );

                        for (var j = 0; j < headers_array.length; j++){
                            headers += String.fromCharCode(headers_array[j]);
                        }

                        out.push({
                            'headers': headers,
                            'getHeader': function(header){
                                var
                                    regexp = new RegExp(header + ': (.+)'),
                                    matches = this.headers.match(regexp);

                                return matches[1];
                            },
                            'content': response.slice(ranges[i].begin, ranges[i].end)
                        })
                    }

                    return out;
                })(this.response, separator);

                callback(parts);
            } else {
                callback(false);
            }
        }
    }

    xhr.responseType = 'arraybuffer';
    xhr.send(null);
};

})(kzvk);
