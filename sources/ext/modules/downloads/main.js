mod.defaults = {
    queue: [],
    history: [],
    count: 1
}

mod.init__content = () => {
//    mod.buttons_registry.init();

    mod.on_loaded.dispatch();
}

mod.init__background = () => {
    mod.history = new mod.DownloadHistory();
    mod.queue = new mod.DownloadQueue();

    // Обработка сообщений
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (sender.id !== chrome.runtime.id)
            return;

        if (request.action === 'download') {
            console.log('download');
            if (request.item) {
                mod.queue.add(request.item);
                return;
            }

            if (kk.is_A(request.items) && request.items.length > 0) {
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
