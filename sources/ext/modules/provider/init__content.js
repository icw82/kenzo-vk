mod.init__content = function() {

    var port = browser.runtime.connect({
        name: mod.full_name
    });

    mod.current_tab = {
        port_of_background: port
    }

    // Ожидание подтверждения
    port.onMessage.addListener(awaiting_confirmation);

    function awaiting_confirmation(message, port) {
        if (message.action != 'confirm the registration') return;

        //mod.log('confirm the registration');

        // Остановка слушателя
        port.onMessage.removeListener(awaiting_confirmation);

        // Новый слушатель
        port.onMessage.addListener(after_confirmation);

        mod.current_tab.id = message.tab_id;

        // Инъекция скрипта в страницу
        mod.inject(message.tab_id, message.key);

    }

    var ignore_actions = [
        'get:response',
        'get:response-from-page'
    ]

    function after_confirmation(message, port) {
        if (message.action === 'page is connected') {
            mod.on_loaded.dispatch();
        } else
            each (ignore_actions, function(item) {
                if (message.action === item)
                    return true;
            }, function() {
                mod.log('incoming message from BG', message);
            });
    }

    port.onDisconnect.addListener(function() {
        // TODO: попытка перезапуска
        mod.log('onDisconnect', arguments);
    });

    // Запрос регистрации экземпляра (вкладки)
    port.postMessage({action: 'register content'});
}
