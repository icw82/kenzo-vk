mod.init__content = () => {

    const transceiver = {
        onMessageFromBackground: new kk.Event(),
        onMessageFromPage: new kk.Event()
    }

    // Создание соединения с фоновой страницей
    {
        const connectToBackground = () => {
            const port = browser.runtime.connect({
                name: mod.full_name
            });

            return port;
        }

        let port = connectToBackground();

        port.onDisconnect.addListener(port => {
            if (port.error) console.log(
                `Disconnected due to an error: ${port.error.message}`);
        });

        port.onMessage.addListener(data => {
            transceiver.onMessageFromBackground
                .dispatch(data);
        });

        // TEST
        port.postMessage({action: 'NEW SHIT'});

//    var ignore_actions = [
//        'get:response',
//        'get:response-from-page'
//    ]
//
//    function after_confirmation(message, port) {
//        if (message.action === 'page is connected') {
//            mod.on_loaded.dispatch();
//        } else
//            each (ignore_actions, function(item) {
//                if (message.action === item)
//                    return true;
//            }, function() {
//                mod.log('incoming message from BG', message);
//            });
//    }
//
//    port.onDisconnect.addListener(function() {
//        // TODO: попытка перезапуска
//        mod.log('onDisconnect', arguments);
//    });
//
//    // Запрос регистрации экземпляра (вкладки)
//    port.postMessage({action: 'register content'});


    }

    // Встраивание приемопередатчика в страницу
    {
        const id = kk.generate_key(15);
        const init_time = Date.now();

        const args = {
            id: id,
            init_time: init_time,
            origin: window.location.origin,
            ext_id: browser.runtime.id,
            root_url: browser.extension.getURL('/'),
            full_name: mod.full_name,
            debug: ext.options.debug.log
        }

        core.utils.inject_isolated_function_to_dom(
            mod.page_transceiver,
            args
        );

        window.addEventListener('message', event => {
            if (
                event.origin !== window.location.origin ||
                event.data.id !== id ||
                event.data.from !== 'page'||
                event.data.to !== 'cs'
            ) return;

            transceiver.onMessageFromPage
                .dispatch(event.data);

        }, false);
    }

    transceiver.onMessageFromBackground.addListener(message => {
        mod.log('Message From Background', message);

    });

    transceiver.onMessageFromPage.addListener(message => {
        mod.log('Message From Page', message);

    });
}
