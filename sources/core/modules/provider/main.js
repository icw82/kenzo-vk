(function(kzvk) {
'use strict';

var mod = {
    name: 'provider',
    version: '1.0.0'
};

mod.init = function(scope) {
    if (typeof scope !== 'string') return;

    mod.full_name = kzvk.name + ': ' + this.name;

//    chrome.tabs.query({url: [
//        "*://vk.com/*",
//        "*://*.vk.com/*",
//        "*://*.vk.me/*"
//    ]}, function(tabs) { console.log(tabs)})

    if (scope === 'content') {
        var port = chrome.runtime.connect({name: mod.full_name});

        port.onMessage.addListener(function(message, port) {
            if (message.action == 'confirm the registration') {
//                mod.tab_id = message.tab_id;
//                mod.key = message.key;

                // Инъекция скрипта в страницу
                mod.inject(message.tab_id, message.key);

            } else {
                console.log('Content: onMessage .message', message);
            }
        });

        port.onDisconnect.addListener(function() {
            console.log('Content: onDisconnect', arguments);
        });

        // Регистрация экземпляра (вкладки)
        port.postMessage({action: 'register content'});

        return true;

    } else if (scope === 'background') {

        var registered_tabs = [];

        chrome.runtime.onConnect.addListener(function(port) {
            if (port.name !== mod.full_name) return;

            var tab_id = port.sender.tab.id;
            var key = kzvk.make_key();

            function listner(message, port) {
                if (message.action == 'register content') {

                    each (registered_tabs, function(item) {
                        if (item.id === tab_id) {
                            item.key = key;
                            return true;
                        }
                    }, function() {
                        registered_tabs.push({
                            id: tab_id,
                            key: key
                        });
                    });

                    port.postMessage({
                        action: 'confirm the registration',
                        tab_id: tab_id,
                        key: key
                    });
                } else {
                    console.log('BG: onMessage .message', message);
                }
            }

            port.onMessage.addListener(listner);

            port.onDisconnect.addListener(function() {
                console.log('BG: onDisconnect', arguments);
            });

            port.postMessage({action: 'from BG to Content?'});

        });


        chrome.runtime.onConnectExternal.addListener(function(port) {
            if (port.name !== mod.full_name) return;

            port.onMessage.addListener(function(message, port) {
                if (message.action == 'register page') {
                    each (registered_tabs, function(item, index) {
                        if (item.id !== message.tab_id) return;
                        if (item.key !== message.key) return;

                        // Удаление ключа
                        registered_tabs.splice(index, 1);

                        port.postMessage({
                            action: 'confirm the registration'
                        });

                        return true;
                    });

                } else {
                    console.log('BG: onMessage (External) .message', message);
                }
            });

            port.onDisconnect.addListener(function() {
                console.log('BG: onDisconnect (External)', arguments);
            });

            port.postMessage({action: 'from BG to Page?'});

        });

        return true;
    }
//    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
//    // Существует ничтожно малая вероятность коллизии (примерно 1:(3*10^64))
//    if (request.action === 'register audio provider') {
//        each (mod.keys, function(key, i) {
//           if (key === request.key) {
//               mod.keys[i] = kzvk.make_key();
//               sendResponse(mod.keys[i]);
//               return true;
//           }
//        });
//    }
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
