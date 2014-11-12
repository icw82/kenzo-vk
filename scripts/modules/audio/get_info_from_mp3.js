(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

mod.get_more_info_from_mp3 = function(url, _, callback){

    if (!_.tag_length)
        _.tag_length = 0;

    var offset = _.tag_length,
        ranges = [
            [offset, offset + 40] //170
        ];

    // Чтение заголовка mp3 фрейма
    function read_frame_header(view){
        var view_binary = kenzo.i8ArrayTo2(view);

        // AAAAAAAAAAA BB CC D EEEE FF G H II JJ K L MM
        // 11111111111 11 01 1 1001 00 0 0 01 10 0 1 00

        // A
        if (view_binary.slice(0, 11) !== '11111111111'){
            _.error = 'Фрейм не обнаружен';
            return false;
        }

        // B
        if (view_binary.slice(11, 13) !== '11'){
            _.error = 'Версия не MPEG 1';
            return false;
        }

        // E
        _.bitrate = {
            '01': [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0],
            '10': [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
            '11': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0]
        }[view_binary.slice(13, 15)][parseInt(view_binary.slice(16, 20), 2)];

        // F
        _.samplerate = {
            '00': 44100,
            '01': 48000,
            '10': 32000
        }[view_binary.slice(20, 22)];

        // I
        _.channelmode = parseInt(view_binary.slice(24, 26), 2);
// ['Stereo', 'Joint stereo (Stereo)', 'Dual channel (Stereo)', 'Single channel (Mono)'];

    }

    function check_vbr(view){
        var header = kenzo.i8ArrayToString(view);

        if (header === 'VBRI' || header === 'Xing'){
            _.vbr = header;
        } else if (_.channelmode === 3){
            view = new Uint8Array(response[0].content, 21, 4);
            header = kenzo.i8ArrayToString(view);
            if (header === 'Xing')
                _.vbr = header;
        }

//        var view = new Uint8Array(response[0].content, 155, 15);
//        console.log(header, view , kenzo.i8ArrayToString(view));

    }


    kzvk.get_buffer(url, ranges, function(response){

        // VBR по умолчанию false;
        _.vbr = false;

        read_frame_header(new Uint8Array(response[0].content, 0, 4));

        if ('error' in _){
            //console.warn(_.error);
            callback(_);
            return false;
        }

        check_vbr(new Uint8Array(response[0].content, 36, 4));

        callback(_);
    });
};


// from Content-Range
mod.get_file_size_from_range = function(range){
    var _ = range.match(/\d+?$/);

    if (_ && _[0])
        return parseInt(_[0]);
    else
        return false;
};

mod.get_info_from_mp3 = function(url, callback){
    if (typeof callback != 'function'){
        console.warn('get_info_from_mp3: callback не функция');
        return false;
    }

    var range = [[0, 9], [-128]],
        _ = {
            'available': false
        };

    kzvk.get_buffer(url, range, function(response){
        if (response && response[0].headers){
            var first_part = response[0],
                last_part = response[1],
                type = first_part.getHeader('Content-Type'),
                range = first_part.getHeader('Content-Range');

            if (type != 'audio/mpeg'){
                console.log('get_info_from_mp3: не «audio/mpeg»');
                callback(_);
                return false;
            }

            _.available = true;

            // Размер файла
            _.size = mod.get_file_size_from_range(range);

            if (!_.size){
                callback(_);
                return false;
            }

            // Версия тега
            _.tag_version = (function(first_part, last_part){
                var tag = new Uint8Array(first_part.content, 0, 3);
                tag = kenzo.i8ArrayToString(tag);

                if (tag == 'ID3'){
                    var version = new Uint8Array(first_part.content, 3, 1);
                    return 'ID3v2.' + version[0];
                } else {
                    tag = new Uint8Array(last_part.content, 0, 3);
                    tag = kenzo.i8ArrayToString(tag);
                    if (tag == 'TAG'){
                        return 'ID3v1'; // TODO ID3v1.1
                    } else {
                        //console.log('get_info_from_mp3: тег не обнаружен', tag);
                        return false;
                    }
                }
            })(first_part, last_part);

            if (!_.tag_version){
                callback(_);
                return false;
            }

            if (_.tag_version && (_.tag_version != 'ID3v1')){
                _.tag_length = 10 + (function(buffer){
                    var length = new Uint8Array(first_part.content, 6, 4);
                    return length[3] & 0x7f
                        | ((length[2] & 0x7f) << 7)
                        | ((length[1] & 0x7f) << 14)
                        | ((length[0] & 0x7f) << 21);
                })(first_part.content);
            }

            // VBR
            if (kzvk.options.audio__vbr){
                mod.get_more_info_from_mp3(url, _, function(_){
                    callback(_);
                });
            } else {
                callback(_);
            }

        } else {
            callback(_);
        }
    });
}

})(kzvk);
