// Пока разработчики не родили нормальный тригер изменения url
mod.location = (function() {
    var period = 50;
    var id;

    // scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
    var correspondence = {
        scheme: 'protocol',
        host: 'hostname',
        port: 'port',
        path: 'pathname',
        query: 'search',
        fragment: 'hash'
    };

    var last_state = {};
    var callbacks = {};

    var check = function() {
        if (!last_state.url) {
            last_state.url = window.location.href;

            for (let key in correspondence) {
                last_state[key] = window.location[correspondence[key]];
            }

        } else {
            if (last_state.url === window.location.href) return;
            var changes = [];

            for (let key in correspondence) {
                if (last_state[key] !== window.location[correspondence[key]]) {
                    last_state[key] = window.location[correspondence[key]]
                    changes.push(key);
                }
            }

            last_state.url = window.location.href;
            run_callbacks(changes);
        }
    }

    var run_callbacks = function(changes) {
        if (changes.length <= 0) return;
        var executed = [];
        each (changes, function(key) {
            each (callbacks[key], function(callback) {
                each (executed, function(item) {
                    if (callback === item)
                        return true;
                }, function() {
                    executed.push(callback);
                    callback();
                });
            });
        });
    }

    var _ = {
        start: function() {
            if (!id)
                setInterval(check, period);
        },
        stop: function() {
            clearInterval(id);
            last_state = {};
            id = false;
        },
        addEventListener: function(event_name, callback) {
            if (typeof event_name == 'sting') return;
            if (!correspondence[event_name]) return;

            if (!callbacks[event_name])
                callbacks[event_name] = [];

            each (callbacks[event_name], function(cb) {
                if (cb === callback)
                    return true;
            }, function() {
                callbacks[event_name].push(callback);

            });
        },
        removeEventListener: function(event_name, callback) {
            if (typeof event_name == 'sting') return;
            if (!correspondence[event_name]) return;

            each (callbacks[event_name], function(cb, index) {
                if (cb === callback) {
                    callbacks[event_name].splice(index, 1);
                    return true;
                }
            });
        }
    };


    return _;

})();

ext.location = mod.location;
