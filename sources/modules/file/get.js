// TODO: Разделить на контексты.

//                          нет
//                 есть?  ——————> Достать новую инфу ———————\
// Чекнуть в кэше ——————>   да                              |————> Записать в кэш
//                        ——————> Вернуть инфу в промис <———/

mod.get = url => new Promise(function(resolve, reject) {

    if (!kk.is_s(url)) {
        throw 'file.get: url is\'nt string';
    }

    if (url === '') {
        throw 'file.get: url is empty string';
    }

    mod.cache.get(url, 'basic.url').then(data => {
        if (data.length > 1) {
//            mod.warn('cached data', data);
        }

        resolve(data[0]);

    }, event => {
        const data = {
            basic: {
                url: url
            }
        };

        mod.get__headers(url).then(result => {
            Object.assign(data.basic, result.basic);

            if (result.basic.mime === 'audio/mpeg') {
                mod.submodules.audio_mpeg.parse(url).then(data => {
//                    mod.info('audio_mpeg >', data);
                    mod.cache.put(data);
                    resolve(data);
                }, reject);

            } else {
                mod.warn('Неизвестный MIME-тип', url, data);
                reject(data);
            }

        }, reject);

    });

//    calc_mp3_bitrate_classic(size, duration) {
//        var kbps = Math.floor(size * 8 / duration / 1000);
//
//        if ((kbps >= 288)) kbps = 320; else
//        if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
//        if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
//        if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
//        if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
//        if ((kbps >= 80 ) && (kbps < 112)) kbps = 96; else
//        if ((kbps >= 48 ) && (kbps < 80 )) kbps = 64; else
//        if ((kbps >= 20 ) && (kbps < 48 )) kbps = 32;
//
//        return kbps;
//    }

});
