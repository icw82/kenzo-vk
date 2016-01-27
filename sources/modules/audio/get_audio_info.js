mod.get_audio_info = function(id, url) {
    if (!id || !url) {
        mod.error('Нет аргументов');
        return;
    }

//                          нет
//                 есть?  ——————> Достать новую инфу ———————\
// Чекнуть в кэше ——————>   да                              |————> Записать в кэш
//                        ——————> Вернуть инфу в промис <———/

    var promise = new Promise(function(resolve, reject) {
        mod.cache.get(id).then(function(data) {
            mod.log('cache data', data);
            resolve(data);

        }, function(event) {
            mod.get_info_from_mp3(url, function(data) {
                mod.log('### file data', data);

                resolve(data);

                mod.cache.put({
                    id: id,
                    size: data.size,
                    vbr: data.vbr,
                    bitrate: data.bitrate,
                    tag_version: data.tag_version,
                    tag_length: data.tag_length,
                    hash: data.hash
                });

            });
        });
    });

    return promise;
}
