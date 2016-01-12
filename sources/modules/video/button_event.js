mod.button_event = function(item, event) {
    if (event.type === 'dragstart') {
        var dt = event.dataTransfer;

        if (item.ext === 'mp4')
            var mime = 'video/mp4';
        else
            return;

        var data = mime + ':' + item.filename + ':' + item.url;

        dt.setData('DownloadURL', data);

        return;
    }

    kk.event.stop(event);

    function start() {
        chrome.runtime.sendMessage({
            action: 'vk-video__save',
            url: item.url_clean,
            name: item.filename,
            id: item.host.id,
            format: item.format
        });
    }

    function stop() {
        chrome.runtime.sendMessage({
            action: 'vk-video__stop-download',
            id: item.host.id,
            format: item.format
        });
    }

    if (event.type === 'click') {
        if (typeof item.progress == 'undefined' || item.progress === null)
            start();
        else
            stop();
    }
}
