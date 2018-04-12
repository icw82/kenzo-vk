// Встраиваемый приемопередатчик
mod.page_transceiver = function(settings) {

    const log_prefix = settings.full_name + ' (page) —';

    const transceiver = {
        onMessageFromContentScript: new kk.Event(),
        onMessageFromBackground: new kk.Event(),
        methods: {}
    }

    window.KenzoTransceiver = transceiver;


    // I N P U T

    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin)
            return;

        if (event.data.key !== settings.key)
            return;

        if (event.data.to !== 'page')
            return;

        if (event.data.from === 'cs') {
            transceiver.onMessageFromContentScript
                .dispatch(event.data);

        } else if (event.data.from === 'bg') {
            transceiver.onMessageFromBackground
                .dispatch(event.data);

        } else
            throw Error('адресат и отправитель одинаковы');

    }, false);


    // O U T P U T

    transceiver.postMessage = (message, address, callback) => {
        if (!['cs', 'bg'].includes(address))
            throw Error('Неверный адрес');

        wrapper = {
            key: settings.key,
            from: 'page',
            to: address,
            message: message
        }

        // Ожидание ответа (callback)
        if (kk.is_f(callback)) {
            const message_id = `${ kk.generate_key(15) }-${ Date.now() }`;
            wrapper.message_id = message_id;
        }

//        console.log('-- 1 --', wrapper);

        window.postMessage(wrapper, settings.origin);
    }


    // E V E N T S

    transceiver.onMessageFromContentScript.addListener(message => {
        settings.debug &&
            console.log(log_prefix, 'Message From ContentScript', message);

        if (message.method in transceiver.methods) {
            transceiver.methods[message.method](...message.args).then(data => {
                const response = {
                    key: settings.key,
                    id: message.id,
                    ts: message.ts,
                    from: 'page',
                    to: 'cs',
                    response: data
                }

                window.postMessage(response, settings.origin);

            }, error => {
                settings.debug && console.error(log_prefix, error);
            });
        }

    });

    transceiver.onMessageFromBackground.addListener(message => {
        settings.debug &&
            console.log(log_prefix, 'Message From Background', message);

    });


    // M E T H O D S

    transceiver.methods.get = async path => {
        try {
            const response = window.eval(path);
            return window.eval(path);
        } catch (error) {
            settings.debug && console.error(log_prefix, error);
        }
    }

    transceiver.methods.httpRequest = async params => {
//        settings.debug &&
//            console.log(log_prefix, 'params', params);

        const xhr = new XMLHttpRequest();
        xhr.open(params.method, params.url, true);
        if (params.headers) {
            for (let key in params.headers) {
                xhr.setRequestHeader(key, params.headers[key]);
            }
        }

        xhr.send(params.query);

        return await new Promise((resolve, reject) => {
            xhr.onload = () => resolve(xhr.response)
        });
    }


    // I N I T

    {
        const id = kk.generate_key(15);
        const ts = Date.now();

        const message = {
            key: settings.key,
            id: id,
            ts: ts,
            from: 'page',
            to: 'cs',
            method: 'init'
        }

        window.postMessage(message, settings.origin);
    }

}
