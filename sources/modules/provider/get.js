(function (kzvk) {
'use strict';

var mod = kzvk.modules.provider;

// How to use
//kzvk.modules.provider.get('test').then(function(response) {
//
//}, function(response) {
//
//});

mod.get = function(value, tab) {
    var key = kzvk.make_key();

    return new Promise(function(resolve, reject){
        if (kzvk.scope === 'content') {
            // Если вызывается из CS
            tab = mod.current_tab;
            var port = tab.port_of_background;

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

                if (message.error)
                    reject(message.error)
                else
                    resolve(message.value);
            }

        } else if (kzvk.scope === 'background') {
            // Если вызывается из BG (proxi)
            var port = tab.port_of_page;

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

                if (message.error)
                    reject(message.error)
                else
                    resolve(message.value);
            }

        } else
            reject('error epta');
    });
}

})(kzvk);
