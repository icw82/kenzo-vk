(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

function i8ArrayTo2(array){
    var _ = '';
    each (array, function(item){
        _ += i8to2(item);
    });
    return _;
}

function i8to2(int8){
    var _ = int8.toString(2);
    while (_.length < 8){
        _ = '0' + _;
    }
    return _;
}

function i8ArrayToString(array){
    var _ = '';
    each (array, function(item){
        _ += String.fromCharCode(item);
    });
    return _;
}


// MODEL AND CONTROLLERs
mod.get_more_mp3_info = function(url, info, callback){

    var offset = info.mp3.tag_length,
        ranges = [
            [offset, offset + 40] //170
        ];

    kzvk.get_buffer(url, ranges, function(response){

        // VBR по умолчанию false;
        info.mp3.vbr = false;

        // Чтение заголовка mp3 фрейма
        (function(){
            var view = new Uint8Array(response[0].content, 0, 4),
                view_binary = i8ArrayTo2(view);

            // AAAAAAAAAAA BB CC D EEEE FF G H II JJ K L MM
            // 11111111111 11 01 1 1001 00 0 0 01 10 0 1 00

            // A
            if (view_binary.slice(0, 11) !== '11111111111'){
                info.mp3.error = 'Фрейм не обнаружен';
                return false;
            }

            // B
            if (view_binary.slice(11, 13) !== '11'){
                info.mp3.error = 'Версия не MPEG 1';
                return false;
            }

            // E
            info.mp3.bitrate = {
                '01': [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0],
                '10': [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
                '11': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0]
            }[view_binary.slice(13, 15)][parseInt(view_binary.slice(16, 20), 2)];

            // F
            info.mp3.samplerate = {
                '00': 44100,
                '01': 48000,
                '10': 32000
            }[view_binary.slice(20, 22)];

            // I
            info.mp3.channelmode = parseInt(view_binary.slice(24, 26), 2);
// ['Stereo', 'Joint stereo (Stereo)', 'Dual channel (Stereo)', 'Single channel (Mono)'];

        })();

        if ('error' in info.mp3){
            //console.warn(info.mp3.error);
            callback(info);
            return false;
        }

        // Проверка на наличие VBR заголовков
        (function(){
            var view = new Uint8Array(response[0].content, 36, 4),
                header = i8ArrayToString(view);


            if (header === 'VBRI' || header === 'Xing'){
                info.mp3.vbr = header;
            } else if (info.mp3.channelmode === 3){
                view = new Uint8Array(response[0].content, 21, 4);
                header = i8ArrayToString(view);
                if (header === 'Xing')
                    info.mp3.vbr = header;
            }

            callback(info);
/*
            var view = new Uint8Array(response[0].content, 155, 15);
            console.log(header, view , i8ArrayToString(view));
*/
        })();
    });
};

mod.get_mp3_info = function(url, callback, vbr){
    if (typeof callback != 'function'){
        console.warn('kzvk: callback не функция');
        return false;
    }

    var range = [0, 9],
        data = {
            'available': false,
            'mp3': {}
        };

    kzvk.get_buffer(url, range, function(response){
        if (response && response[0].headers){
            response = response[0];

            if (response.getHeader('Content-Type') != 'audio/mpeg'){
                console.log('KZVK: не «audio/mpeg»');
                callback(data);
                return false;
            }

            data.available = true;
            var buffer = response.content;

            // Размер файла
            data.mp3.size = (function(range){
                var out = range.match(/\d+?$/);
                if (out && out[0])
                    return parseInt(out[0]);
                else
                    return false;
            })(response.getHeader('Content-Range'));

            if (!data.mp3.size){
                callback(data);
                return false;
            }

            // Версия тега
            data.mp3.tag_version = (function(buffer){
                var identifier = new Uint8Array(buffer, 0, 3);
                identifier = String.fromCharCode(identifier[0], identifier[1], identifier[2]);

                if (identifier == 'ID3'){
                    var version = new Uint8Array(buffer, 3, 1);
                    return 'ID3v2.' + version[0];
                } else {
                    //console.log('KZVK: not ID3v2');
                    return false;
                }
            })(buffer);

            if (!data.mp3.tag_version){
                callback(data);
                return false;
            }

            // Длина тега
            data.mp3.tag_length = 10 + (function(buffer){
                var length = new Uint8Array(buffer, 6, 4);

                return length[3] & 0x7f
                    | ((length[2] & 0x7f) << 7)
                    | ((length[1] & 0x7f) << 14)
                    | ((length[0] & 0x7f) << 21);
            })(buffer);

            // VBR
            if (vbr){
                mod.get_more_mp3_info(url, data, function(response){
                    callback(response);
                });
            } else {
                callback(data);
            }
        } else {
            callback(data);
        }
    });
}

//
mod.get_advanced_info = function(info){
    if (info.available === true){
        if (kzvk.options.audio__cache === true){
            // получить информацию из кэша
            // и если её там нет, то напрямую
            mod.get_mp3_info(info.url, function(response){
                //console.log('get_mp3_info callback', response);

                if (response.available === true)
                    info.available = true;
                if ('mp3' in response){
                    for (var key in response.mp3){
                        info[key] = response.mp3[key];
                    }
                }

            }, kzvk.options.audio__vbr);
        } else {
            mod.get_mp3_info(info.url, function(response){
//                console.log('get_mp3_info callback', response);

                if (response.available === true)
                    info.available = true;
                if ('mp3' in response)
                    info.mp3 = response.mp3;

            }, kzvk.options.audio__vbr);
        }
    } else {
        //console.log(info);
    }
}

})(kzvk);
