sub.read_Xing = (buffer, data) => {
    const Xing = {};
    let offset = 4; // 4 bytes of header

    if (data.mpeg_version === 1) {
        if (data.channel_mode === 3) // mono
            offset += 17;
        else
            offset += 32;
    } else {
        if (data.channel_mode === 3) // mono
            offset += 9;
        else
            offset += 17;
    }

    const view = new Uint8Array(buffer, offset);

    // Xing
    if (view[0] === 88, view[1] === 105, view[2] === 110, view[3] === 103) {
        Xing.name = 'Xing';

        let flags = kk.i8to2(view[7]);
        let offset = 8;

        Xing.frames = !!parseInt(flags[7], 2);
        Xing.bytes = !!parseInt(flags[6]);
        Xing.TOC = !!parseInt(flags[5]);
        Xing.quality = !!parseInt(flags[4]);

        if (Xing.frames) {
            Xing.frames = parseInt(kk.i8ArrayTo2(view.slice(offset, offset + 4)), 2);
            offset += 4;
        }

        if (Xing.bytes) {
            Xing.bytes = parseInt(kk.i8ArrayTo2(view.slice(offset, offset + 4)), 2);
            offset += 4;
        }

        if (Xing.TOC) {
//            Xing.TOC = view.slice(offset, offset + 100);
//            console.log(sub.seek_point(Xing.TOC, Xing.bytes, 50));
            offset += 100;
        }

        if (Xing.quality) {
            Xing.quality = parseInt(kk.i8ArrayTo2(view.slice(offset, offset + 4)), 2);
            offset += 4;
        }

        return Xing;

    // Info
    } if (view[0] === 73, view[1] === 110, view[2] === 102, view[3] === 111) {
        return false;
    }
}
