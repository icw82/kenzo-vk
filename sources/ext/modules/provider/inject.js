mod.inject = function(tab_id, key) {
    if ((typeof tab_id != 'number') || (typeof key != 'string')) return;

    var provider = document.createElement('script');

    // Объект, передаваемый в формате JSON изолированной функции
    var _ = {
        ext_id: browser.runtime.id,
        full_name: mod.full_name,
        key: key,
        tab_id: tab_id,
        debug__log: ext.options.debug__log
    }

    // Функция-провайдер, передаваемая во внешний скрипт в форме текста.
    // Работает только в контексте страницы.
    var isolated_function = function(_) {
        var browser = chrome; // FIXME
        var port = browser.runtime.connect(_.ext_id, {name: _.full_name});

        port.onMessage.addListener(awaiting_confirmation);

        function awaiting_confirmation(message, port) {
            if (message.action != 'confirm the registration') return;

            // Остановка слушателя
            port.onMessage.removeListener(awaiting_confirmation);

            // Новый слушатель
            port.onMessage.addListener(after_confirmation);

            _.debug__log &&
                console.log(_.full_name, '— Page is connected');
        }

        function after_confirmation(message, port) {
            if (message.action === 'get')
                methods.get(message, port);
            else
                _.debug__log &&
                    console.log(_.full_name, '(page) incoming message', message);
        }

        port.onDisconnect.addListener(function() {
            _.debug__log &&
                console.log('Page: onDisconnect', arguments);
        });

        port.postMessage({
            action: 'register page',
            tab_id: _.tab_id,
            key: _.key
        });

        var methods = {};

        methods.get = function(message, port) {
            if (typeof message.key !== 'string') return;
            if (typeof message.value !== 'string') return;

            var response = {
                action: 'get:response-from-page',
                key: message.key
            }

            try {
                response.value = window.eval(message.value);
                response.meta = {};
                if (response.value instanceof Element) {
                     response.meta.is_element = true;
                } else if (response.value instanceof NodeList) {
                     response.meta.is_nodelist = true;
                }
            } catch (error) {
                // FUTURE: Как передать весь стек?
                response.error = error.toString();
            }

            port.postMessage(response);
        }
    }

    provider.innerHTML = '(' + isolated_function + ')(' + JSON.stringify(_) + ')';

    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(provider);
        // Сразу после создания DOM-объекта, функция выполняется.
        // Проверка показала, что скрипт-провайдер выполняется в первую очередь
        // и маловероятно, что чужеродный скрипт (eve.js) может сымитировать поведение
        // провайдера, прежде, чем последний будет выполнен (будет создана связь).
    });
}
