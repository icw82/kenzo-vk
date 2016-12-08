sub.get_next_part = data => new Promise((resolve, reject) => {
    if (!(data.meta instanceof ReadingStatus)) {
        // Первый запуск
        let offset;

        if (data.ID3v2[0] && data.ID3v2[0].length) {
            offset = data.ID3v2[0].length + 10;
        } else {
            offset = 0;
        }

        data.meta = new ReadingStatus(offset, sub.required_lenth_of_frame_header);
    } else {
        if (data.meta.iteration > 10) {
            reject('Превышено количество допустимых итераций поиска фрейма');
            return;
        }

        if (data.meta.cursor >= data.basic.size) {
            reject('Достигнут конец файла, фрейм не обнаружен');
            return;
        }
    }

    kk.get_buffer(data.basic.url, data.meta.range).then(response => {
        data.meta.count();
        resolve(response.content);
    }, reject);

});
