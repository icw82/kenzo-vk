// How to use
//ext.modules.provider.get('test').then(function(response) {
//
//}, function(response) {
//
//});

mod.get = function(value, tab) {
    var key = kk.generate_key(15);

    return new Promise(function(resolve, reject) {
        if (core.scope === 'content') {
            // Если вызывается из CS
            tab = mod.current_tab;
            var port = tab.port_of_background;

//            mod.log('>> @@@ >>', value);

            port.postMessage({
                action: 'get',
                key: key,
                value: value
            });

            port.onMessage.addListener(awaiting_to_response);

            function awaiting_to_response(message, port) {
                if (message.action !== 'get:response') return;
                if (message.key !== key) return;

                port.onMessage.removeListener(awaiting_to_response);

                var response = {
                    value: message.value,
                    meta: message.meta
                }

                if (message.error)
                    reject(message.error)
                else
                    resolve(response);
            }

        } else if (core.scope === 'background') {
            // Если вызывается из BG (proxy)
            mod.log('proxy', value);

            var port = tab.port_of_page;

//            mod.log('>> @@@ >>', value);

            port.postMessage({
                action: 'get',
                key: key,
                value: value
            });

            port.onMessage.addListener(awaiting_to_response);

            function awaiting_to_response(message) {
                if (message.action !== 'get:response-from-page') return;
                if (message.key !== key) return;

                port.onMessage.removeListener(awaiting_to_response);

                var response = {
//                    error: message.error,
                    value: message.value,
                    meta: message.meta
                }

                if (message.error)
                    reject(message.error)
                else
                    resolve(response);
            }

        } else
            reject('error epta');
    });
}
