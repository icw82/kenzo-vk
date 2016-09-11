sub.find_headers = data => new Promise((resolve, reject) => {
    sub.get_next_part(data).then(part => {
        let view = new Uint8Array(part);

//        console.log('Iteration №', data.meta.iteration, data.basic.url);

        // FIX: Одинаковый код
        let ID3v2_offset = sub.find_ID3v2_header(part);
        if (ID3v2_offset !== false) {
            let buffer = part.slice(ID3v2_offset, ID3v2_offset + 10);
            let ID3v2 = sub.read_ID3v2_header(buffer);

            if (ID3v2) {
                ID3v2.offset = data.meta.previous.range[0] + ID3v2_offset;
                data.ID3v2.push(ID3v2);

                data.meta.cursor = data.meta.previous.range[0] + ID3v2.length;
                sub.find_headers(data).then(resolve, reject);

                return;
            }
        }

        let frame_offset = sub.find_frame_header(part);
        if (frame_offset !== false) {
            let buffer = part.slice(frame_offset, frame_offset +
                sub.required_lenth_of_frame_header);

            let frame = sub.read_frame_header(buffer);
            if (frame) {
                frame.offset = data.meta.previous.range[0] + frame_offset;
                data.MPEG = frame;
                delete data.meta;

                data.MPEG.content_length = data.basic.size - data.MPEG.offset;

                if (data.ID3v1)
                    data.MPEG.content_length -= 128;

                if (kk.is_o(data.MPEG.method)) {
                    if (data.MPEG.method.name === 'Xing' || data.MPEG.method.name === 'VBRI') {
                        data.MPEG.duration =
                            data.MPEG.method.frames *
                            data.MPEG.samples_per_frame / data.MPEG.sampling_rate;
                    } else {
                        reject('ERROR 20160814-2');
                    }

                } else if (data.MPEG.method === 'CBR') {
                    data.MPEG.duration = data.MPEG.content_length * 8 / data.MPEG.bitrate / 1000;
                } else {
                    reject('ERROR 20160814-1');
                }

                resolve(data);

                return;
            }
        }

//        console.log(kk.i8ArrayToString(view));
//        console.log(kk.i8ArrayTo2(view));

        sub.find_headers(data).then(resolve, reject);

    }, reject);
});
