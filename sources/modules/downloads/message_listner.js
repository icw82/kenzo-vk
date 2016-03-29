mod.message_listner = function(request, sender, sendResponse) {
    if (sender.id !== chrome.runtime.id)
        return false;

    if (request.action === 'vk-audio__save') { // AUDIO
        chrome.downloads.download({
            url: request.url,
            filename: ext.filter.file_name(request.name),
            conflictAction: 'prompt'
        }, function(download_id) {
            mod.add_to_current(download_id, 'vk-audio', request.id);
        });
    } else if (request.action === 'vk-audio__stop-download') {
        chrome.storage.local.get('downloads', function(data) {
            each (data.downloads.current, function(item) {
                if (request.id === item.id && item.type === 'vk-audio') {
                    chrome.downloads.cancel(item.download_id);
                    return true;
                }
            });
        });
    } else if (request.action === 'vk-video__save') { // VIDEO
        chrome.downloads.download({
            url: request.url,
            filename: ext.filter.file_name(request.name),
            conflictAction: 'prompt'
        }, function(download_id) {
            // Note: формат тут нужен для того, чтобы не возникло путаницы.
            mod.add_to_current(download_id, 'vk-video', request.id, request.format);
        });
    } else if (request.action === 'vk-video__stop-download') {
        chrome.storage.local.get('downloads', function(data) {
            each (data.downloads.current, function(item) {
                if (
                    request.id === item.id &&
                    request.format === item.format &&
                    item.type === 'vk-video'
                ) {
                    chrome.downloads.cancel(item.download_id);
                    return true;
                }
            });
        });
    }
}
