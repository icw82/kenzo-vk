// Встраиваемый приемопередатчик
mod.page_transceiver = function(args) {

    const transceiver = {
        onMessageFromContentScript: new kk.Event(),
        onMessageFromBackground: new kk.Event()
    }

    const log_prefix = args.full_name + ' (page) —';

    window.addEventListener('message', event => {
        if (
            event.origin !== window.location.origin ||
            event.data.id !== args.id ||
            event.data.to !== 'page'
        ) return;

        if (event.data.from === 'cs') {
            transceiver.onMessageFromContentScript
                .dispatch(event.data);

        } else if (event.data.from === 'bg') {
            transceiver.onMessageFromBackground
                .dispatch(event.data);

        } else
            throw Error('адресат и отправитель одинаковы');

    }, false);

    transceiver.onMessageFromContentScript.addListener(message => {
        args.debug &&
            console.log(log_prefix, 'Message From ContentScript', message);

    });

    transceiver.onMessageFromBackground.addListener(message => {
        args.debug &&
            console.log(log_prefix, 'Message From Background', message);

    });

    transceiver.postMessage = (message, address, callback) => {
        if (!['cs', 'bg'].includes(address))
            throw Error('Неверный адрес');

        wrapper = {
            id: args.id,
            from: 'page',
            to: address,
            message: message
        }

        // Ожидание ответа (callback)
        if (kk.is_f(callback)) {
            const message_id = `${ kk.generate_key(15) }-${ Date.now() }`;
            wrapper.message_id = message_id;
        }

        window.postMessage(wrapper, args.origin);
    }

    window.KenzoTransceiver = transceiver;

// Функционал
//    var methods = {};
//
//    methods.get = function(message, port) {
//        if (typeof message.key !== 'string') return;
//        if (typeof message.value !== 'string') return;
//
//        var response = {
//            action: 'get:response-from-page',
//            key: message.key
//        }
//
//        try {
//            response.value = window.eval(message.value);
//            response.meta = {};
//            if (response.value instanceof Element) {
//                 response.meta.is_element = true;
//            } else if (response.value instanceof NodeList) {
//                 response.meta.is_nodelist = true;
//            }
//        } catch (error) {
//            // FUTURE: Как передать весь стек?
//            response.error = error.toString();
//        }
//
//        port.postMessage(response);
//    }

}
