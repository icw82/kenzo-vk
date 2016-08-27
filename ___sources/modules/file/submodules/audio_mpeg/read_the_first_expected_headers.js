// Чтение предполагаемых заголовков
sub.read_the_first_expected_headers = data => new Promise((resolve, reject) => {
    let args = [
        data.basic.url,
        [data.basic.size - 127, data.basic.size - 125],
        [0,  9]
    ];

    kk.get_buffer.apply(null, args).then(parts => {
        if (kk.is_A(parts)) {
            data.ID3v1 = sub.read_ID3v1_header(parts[0].content);
            data.ID3v2 = [];

            // FIX: Одинаковый код
            let ID3v2_offset = sub.find_ID3v2_header(parts[1].content);
            if (ID3v2_offset !== false) {
                let buffer = parts[1].content.slice(ID3v2_offset, ID3v2_offset + 10);
                let ID3v2 = sub.read_ID3v2_header(buffer);

                if (ID3v2) {
                    ID3v2.offset = ID3v2_offset;
                    data.ID3v2.push(ID3v2);
                }
            }

            resolve(data);
        } else {
            reject('ERROR 160811');
        }
    }, reject);
});
