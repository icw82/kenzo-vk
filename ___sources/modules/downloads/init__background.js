mod.init__background = function() {

    mod.history = new mod.DownloadHistory();
    mod.queue = new mod.DownloadQueue();

    // Обработка сообщений
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id) return;

        if (request.action === 'download') {
            if (request.item) {
                mod.queue.add(request.item);
                return;
            }

            if ((request.items instanceof kk._A) && request.items.length > 0) {
                mod.queue.add(request.items)
                return;
            }

            mod.warn('Кажется что-то пошло не так');

        } else if (request.action === 'cancel-download') {
            mod.queue.remove(request.id);

        }
    });

    // FUTURE: Определить зависимости для модулей, использующих загрузки
    mod.on_loaded.dispatch();

}
