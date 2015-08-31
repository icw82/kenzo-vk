(function(kzvk){
'use strict';

var mod = kzvk.modules.provider;

mod.init.content = function() {
    var port = chrome.runtime.connect({
        name: mod.full_name
    });

    // Ожидание подтверждения
    port.onMessage.addListener(awaiting_confirmation);

    function awaiting_confirmation(message, port) {
        if (message.action != 'confirm the registration') return;

        console.log(mod.full_name, '(cs) confirm the registration');

        // Остановка слушателя
        port.onMessage.removeListener(awaiting_confirmation);

        // Новый слушатель
        port.onMessage.addListener(after_confirmation);

        // Инъекция скрипта в страницу
        mod.inject(message.tab_id, message.key);

    }

    function after_confirmation() {
        console.log(mod.full_name, '(cs) incoming message', message);
    }

    port.onDisconnect.addListener(function() {
        // TODO: попытка перезапуска
        console.log('Content: onDisconnect', arguments);
    });

    // Запрос регистрации экземпляра (вкладки)
    port.postMessage({action: 'register content'});
}

})(kzvk);
