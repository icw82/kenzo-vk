(function(kzvk){
'use strict';

var mod = kzvk.modules.provider;

mod.init.background = function() {
    var registered_tabs = [];

    // From Content Script — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —
    chrome.runtime.onConnect.addListener(function(port) {
        if (port.name !== mod.full_name) return;

        var tab_id = port.sender.tab.id;
        var key = kzvk.make_key();

        port.onMessage.addListener(awaiting_registration_request);

        function awaiting_registration_request(message, port) {
            if (message.action != 'register content') return;
            var success = false;

            each (registered_tabs, function(item) {
                if (item.id === tab_id) {
                    item.key = key;
                    success = true;
                    return true;
                }
            }, function() {
                registered_tabs.push({
                    id: tab_id,
                    key: key
                });

                success = true;
            });

            if (!success) return;

            console.log(mod.full_name, '(bg) confirm the registration');

            // Остановка слушателя
            port.onMessage.removeListener(awaiting_registration_request);

            // Новый слушатель
            port.onMessage.addListener(after_registration);

            // Отправка подтверждения, идентификатора вкладки и ключа
            port.postMessage({
                action: 'confirm the registration',
                tab_id: tab_id,
                key: key
            });
        }

        function after_registration() {
            console.log(mod.full_name, '(bg) incoming message from CS', message);
        }

        port.onDisconnect.addListener(function() {
            console.log('BG: onDisconnect', arguments);
        });
    });

    // From Page — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —
    chrome.runtime.onConnectExternal.addListener(function(port) {
        if (port.name !== mod.full_name) return;

        port.onMessage.addListener(awaiting_registration_request);

        function awaiting_registration_request(message, port) {
            if (message.action != 'register page') return;

            each (registered_tabs, function(item, index) {
                if (item.id !== message.tab_id) return;
                if (item.key !== message.key) return;

                // Удаление ключа (больше не нужен)
                registered_tabs.splice(index, 1);

                // Остановка слушателя
                port.onMessage.removeListener(awaiting_registration_request);

                // Новый слушатель
                port.onMessage.addListener(after_registration);

                // Отправка подтверждения
                port.postMessage({
                    action: 'confirm the registration'
                });

                return true;
            }, function() {
                // Совпадений нет
            });
        }

        function after_registration() {
            console.log(mod.full_name, '(bg) incoming message from page', message);
        }

        port.onDisconnect.addListener(function() {
            console.log('BG: onDisconnect (External)', arguments);
        });

    });
}

})(kzvk);
