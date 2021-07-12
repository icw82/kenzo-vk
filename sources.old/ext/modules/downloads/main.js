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

    const handler = (request, sender, sendResponse) => {
        if (
            sender.id !== browser.runtime.id ||
            request.module !== mod.name
        )
            return;

        if (request.action === 'start')
            mod.queue.add(request.args);

        else if (request.action === 'stop')
            mod.queue.remove(request.args);

        else
            mod.warn('Действие не произведено', request);

    }

    // Обработка сообщений
    browser.runtime.onMessage.addListener(handler);

    // FUTURE: Определить зависимости для модулей, использующих загрузки
    mod.on_loaded.dispatch();

}
