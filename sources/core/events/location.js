{
    // Изменение URL (Пока разработчики не родили нормальный тригер изменения url)
    core.events.on_change_location = new kk.Event();
    if (core.scope === 'content') {

        let period = 50;
        let interval_id = false;
        let correspondence = [
            ['scheme', 'protocol'],
            ['host', 'hostname'],
            ['port', 'port'],
            ['path', 'pathname'],
            ['query', 'search'],
            ['fragment', 'hash']
        ];

        let last_state = {};

        let check = function() {
            if (!last_state.url) {
                last_state.url = window.location.href;

                each (correspondence, item => {
                    last_state[item[0]] = window.location[item[1]];
                });

            } else {
                if (last_state.url === window.location.href)
                    return;

                let changes = [];

                each (correspondence, item => {
                    if (last_state[item[0]] !== window.location[item[1]]) {
                        changes.push(item[0]);
                        last_state[item[0]] = window.location[item[1]];
                    }
                });

                last_state.url = window.location.href;

                if (changes.length > 0) {
                    core.events.on_change_location.dispatch(changes);
                }
            }
        }

        let start = () => {
            if (interval_id === false)
                interval_id = setInterval(check, period);
        }

        let stop = () => {
            clearInterval(interval_id);
            last_state = {};
            interval_id = false;
        }

        start();
    }
}
