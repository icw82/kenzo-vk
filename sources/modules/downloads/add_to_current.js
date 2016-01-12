mod.add_to_current = function(download_id, type, id, format) {

    //mod.log('add_to_current:', arguments);

    chrome.storage.local.get('downloads', function(data) {
        data.downloads.current.push({
            download_id: download_id, // идентификатор загрузки
            type: type, // тип загружаемого файла
            id: id, // идентификатор vk
            format: format, // формат (видеозаписи)
            progress: 0
        });

        chrome.storage.local.set({
            'downloads': {
                'current': data.downloads.current
            }
        }, mod.watch.start);
    });
}
