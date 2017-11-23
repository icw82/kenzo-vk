mod.inject = function(tab_id, key) {
    if (!kk.is_n(tab_id) || !kk.is_s(key))
        return;

    const script_element = document.createElement('script');

    // Объект, передаваемый в формате JSON изолированной функции
    const args = {
        ext_id: browser.runtime.id,
        full_name: mod.full_name,
        key: key,
        tab_id: tab_id,
        debug__log: ext.options.debug__log
    }

    // Функция-провайдер, передаваемая во внешний скрипт в форме текста.
    // Работает только в контексте страницы.
    var isolated_function = function(args) {

        var browser = chrome; // FIXME
        var port = browser.runtime.connect(args.ext_id, {name: args.full_name});

        port.onMessage.addListener(awaiting_confirmation);

        function awaiting_confirmation(message, port) {
            if (message.action != 'confirm the registration') return;

            // Остановка слушателя
            port.onMessage.removeListener(awaiting_confirmation);

            // Новый слушатель
            port.onMessage.addListener(after_confirmation);

            args.debug__log &&
                console.log(args.full_name, '— Page is connected');
        }

        function after_confirmation(message, port) {
            if (message.action === 'get')
                methods.get(message, port);
            else
                args.debug__log &&
                    console.log(args.full_name, '(page) incoming message', message);
        }

        port.onDisconnect.addListener(function() {
            args.debug__log &&
                console.log('Page: onDisconnect', arguments);
        });

        port.postMessage({
            action: 'register page',
            tab_id: args.tab_id,
            key: args.key
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

    script_element.innerHTML =
        `(${ isolated_function })(${ JSON.stringify(args) })`;

    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(script_element);
        // Сразу после создания DOM-объекта, функция выполняется.
        // Проверка показала, что скрипт-провайдер выполняется в первую очередь
        // и маловероятно, что чужеродный скрипт (eve.js) может сымитировать поведение
        // провайдера, прежде, чем последний будет выполнен (будет создана связь).
    });
}
