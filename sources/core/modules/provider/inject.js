(function (kzvk) {
'use strict';

var mod = kzvk.modules.provider;

mod.inject = function(tab_id, key) {
    if ((typeof tab_id != 'number') || (typeof key != 'string')) return;

    var provider = document.createElement('script');

    // Объект, передаваемый в формате JSON изолированной функции
    var _ = {
        ext_id: chrome.runtime.id,
        full_name: mod.full_name,
        key: key,
        tab_id: tab_id
    }

    // Функция-провайдер, передаваемая во внешний скрипт в форме текста.
    // Работает только в контексте страницы.
    var isolated_function = function(_) {
        var port = chrome.runtime.connect(_.ext_id, {name: _.full_name});
        //var is_connected = false;

        function listener(message, port) {
            if (message.action == 'confirm the registration') {
                console.log('+++ Page is connected');
            } else {
                console.log('Page: onMessage .message', message);
            }
        }

        port.onMessage.addListener(listener);

        port.onDisconnect.addListener(function() {
            console.log('Page: onDisconnect', arguments);
        });

        port.postMessage({
            action: 'register page',
            tab_id: _.tab_id,
            key: _.key
        });
    }

    provider.innerHTML = '(' + isolated_function + ')(' + JSON.stringify(_) + ')';

    kzvk.dom.body.appendChild(provider);
    // Сразу после создания DOM-объекта, функция выполняется.
    // Проверка показала, что скрипт-провайдер выполняется в первую очередь
    // и маловероятно, что чужеродный скрипт (eve.js) может сымитировать поведение
    // провайдера, прежде, чем последний будет выполнен (будет создана связь).
}

})(kzvk);
