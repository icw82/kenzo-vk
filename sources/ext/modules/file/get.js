mod.get = async url => {
    url = new URL(url);
    url = url.href;

    try {
        const cashed = await mod.cache.get(url.href, 'basic.url');

//    mod.cache.get(url, 'basic.url').then(data => {
//        if (data.length > 1) {
////            mod.warn('cached data', data);
//        }
//
//        resolve(data[0]);
//
        console.warn('cashed', cashed);

    } catch (error) {
        // Если в кэше нет:
        try {
            const data = {
                basic: {
                    url: url
                }
            };

            const header = await mod.get__headers(url);

            Object.assign(data.basic, header.basic);

            if (data.basic.mime === 'audio/mpeg') {
                const meta = await mod.submodules.audio_mpeg.parse(url);
                meta.ts = kk.ts();
//                mod.log('audio_mpeg >', meta);
                mod.cache.put(meta);
                return meta;

            } else {
                mod.warn('Неизвестный MIME-тип', data);
            }



        } catch (error) {
            console.warn('Нет заголовка', error);
        }
    }
}

