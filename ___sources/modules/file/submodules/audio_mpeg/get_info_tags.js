sub.get_info_tags = (url, offset) => new Promise((resolve, reject) => {

    if (!kk.is_n(offset))
        offset = 0;

    const prefix = 'file.audio_mpeg.get_info_tags — ';

    const data = {
        basic: {},
        specific: {}
    };

    const ranges = [[0 + offset, 9 + offset], [-128]]; // TODO: сократить / -128
    // Расширенный тег помещается перед ID3v1 тегом: 227 байт

    kk.get_buffer(url, ranges, response => {
        if (!response || !response[0].headers) {
            reject(prefix + 'incorrect response');
            return;
        }

        {
            let range = response[0].getHeader('Content-Range');
            let match = range.match(/\d+?$/);

            if (match) {
                data.basic.size = parseInt(match[0]);
            } else {
                reject(prefix + 'incorrect Content-Range');
                return;
            }
        }

        const parts = {
            ID3v2: response[0].content,
            ID3v1: response[1].content
        };

        data.specific.ID3v1 = sub.get_info_tags__ID3v1(parts.ID3v1);
        data.specific.ID3v2 = sub.get_info_tags__ID3v2(parts.ID3v2);

        resolve(data);
    });
});

sub.get_info_tags__ID3v1 = buffer => {
    let tag = kk.i8ArrayToString(new Uint8Array(buffer));
    if (tag.substring(0, 3) === 'TAG') {
        let data = {};
        data.length = 128;
        return data;
    }
}

sub.get_info_tags__ID3v2 = buffer => {
    sub.warn(kk.i8ArrayToString(new Uint8Array(buffer)));

    let tag = kk.i8ArrayToString(new Uint8Array(buffer, 0, 3));
    if (tag === 'ID3') {
        let data = {};
        data.version = (new Uint8Array(buffer, 3, 1))[0];
        data.length = (length => 10 +
              length[3] & 0x7f |
            ((length[2] & 0x7f) << 7) |
            ((length[1] & 0x7f) << 14) |
            ((length[0] & 0x7f) << 21)
        )(new Uint8Array(buffer, 6, 4));
        return data;
    }
}
