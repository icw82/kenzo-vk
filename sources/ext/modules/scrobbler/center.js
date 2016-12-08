mod.last_update_request__ts = 0;
mod.last_update_request__name = '';
mod.expiration = 300000; // 1000 * 60 * (5 минут)
mod.acceptable_delay = 1500; // 1,5 секунды

mod.expiration_test = () => {
    // Чистка устаревших записей
    mod.storage.buffer = mod.storage.buffer.filter(
        item => kk.ts() - item.last_update < mod.expiration
    );
}

mod.new_record = status => {
    // Новая запись
    mod.storage.buffer.push({
        id: status.id, // ключ аудиозаписи во вконтакте
        name: status.name, // полное наименование (исполнитель + название)
        duration: status.duration * 1000, //длительность трека, в мс
        state: 0, // прослушано, мс
        first_update: Math.floor(kk.ts() / 1000), // первое обновление,
        last_update: kk.ts(), // последнее обновление,
        last_position: status.current_time, // последняя позиция,
        scrobbled: false // заскробблен ли
    });
}

mod.update_record = (item, status) => {
    // В буфере
//    console.log('exist', item);
//    console.log('status', status);

    const passed = kk.ts() - item.last_update;

    // Если прошло больше 1,5 не засчитывать это время.
    if (passed > mod.acceptable_delay) {
        item.last_update = kk.ts();

    } else {
        // обновить и добавить разность к состоянию
        item.last_update = kk.ts();
        item.state += passed;

        // Отправить информацию на last.fm
        // FUTURE: ограничить частоту запросов
        mod.send_update_request(status);

        // Условия скробблинга
        if (!item.scrobbled) {
            // Если проиграно 4 минуты (по умолчанию)
            if (mod.options.m4m && (item.state >= 240000)) {
                item.scrobbled = true; // FIX: а если ошибка? А если задержка?
                mod.send_scrobble_request(status, item.first_update);
            } else {
                const proportion = Math.round(item.state / item.duration * 100);
//                mod.log('proportion:', proportion);
//                mod.log('state:', Math.round(item.state / 1000));

                if (proportion >= mod.options.proportion) {
                    item.scrobbled = true;
                    mod.send_scrobble_request(status, item.first_update);
                }
            }
        } else {
            // Обнаружение заново включенного трека
            if (status.current_time < item.last_position) {
                item.scrobbled = false;
                item.state = 0;
                item.first_update = Math.floor(kk.ts() / 1000);
            }
        }

    }

    item.last_position = status.current_time;

}

mod.send_update_request = status => {
    const params = {
        artist: status.performer,
        track: status.title,
        duration: status.duration
    }

//    mod.log('send_update_request', status);

    if (
        // обновление раз в 10 сек
        kk.ts() - mod.last_update_request__ts > 10000 ||
        // и при смене названия
        status.name != mod.last_update_request__name
    ) {
        // FIX: если ошибка?
        mod.methods.track.updateNowPlaying(params, r => {
//            mod.log('request sended', r);
        });
        mod.last_update_request__ts = kk.ts();
        mod.last_update_request__name = status.name;
    }
}

mod.send_scrobble_request = (status, first_update) => {
    const params = {
        artist: status.performer,
        track: status.title,
        timestamp: first_update,
        duration: status.duration
    }

    mod.methods.track.scrobble(params);
}

mod.center = status => {
    // Ограничение в 30 сек.
    if (status.duration < 30)
        return false;

//    mod.log('mod.center: status', status);
//    mod.log('mod.storage.buffer', mod.storage.buffer);

    // Поиск записи в буфере
    let beffer_item = each (mod.storage.buffer, item => {
        if (item.name === status.name)
            return item;
    });

    if (beffer_item) {
        mod.update_record(beffer_item, status);
    } else {
        mod.new_record(status);
    }

    mod.expiration_test();
}
