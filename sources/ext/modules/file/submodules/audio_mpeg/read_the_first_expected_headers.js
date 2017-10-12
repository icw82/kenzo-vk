// Чтение предполагаемых заголовков
sub.read_the_first_expected_headers = data => new Promise((resolve, reject) => {
    let args = [
        data.basic.url,
        [data.basic.size - 127, data.basic.size - 125],
        [0,  9]
    ];

    kk.get_buffer(...args).then(result => {

        if (!kk.is_o(result)) {
            reject('read_the_first_expected_headers: некорректыне данные');
        }

        if (kk.is_A(result)) {
            const v1 = result[0].content;
            const v2 = result[1].content;

            data.ID3v1 = sub.read_ID3v1_header(v1);
            data.ID3v2 = [];

            // FIXME: Одинаковый код
            let ID3v2_offset = sub.find_ID3v2_header(v2);
            if (ID3v2_offset !== false) {
                let buffer = v2.slice(ID3v2_offset, ID3v2_offset + 10);
                let ID3v2 = sub.read_ID3v2_header(buffer);

                if (ID3v2) {
                    ID3v2.offset = ID3v2_offset;
                    data.ID3v2.push(ID3v2);
                }
            }

            resolve(data);
        } else if (
            'content' in result &&
            (result.content instanceof ArrayBuffer)
        ) {
            sub.warn('Почему не массив?');
            reject('ERROR 160811');
        }
    }, reject);
});
