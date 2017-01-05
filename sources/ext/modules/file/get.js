//                          нет
//                 есть?  ——————> Достать новую инфу ———————\
// Чекнуть в кэше ——————>   да                              |————> Записать в кэш
//                        ——————> Вернуть инфу в промис <———/

mod.get = url => new Promise((resolve, reject) => {
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

    // Если в кэше нет:
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
                    data.ts = kk.ts();
//                    mod.info('audio_mpeg >', data);
                    mod.cache.put(data);
                    resolve(data);
                }, reject);

            } else {
                mod.warn('Неизвестный MIME-тип', url, data);
                reject(data);
            }

        }, error => {
//            mod.warn('ОНО', url);
            reject(error);
        });
    });
});
