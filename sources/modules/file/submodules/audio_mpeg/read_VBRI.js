// Fraunhofer Encoder
sub.read_VBRI = buffer => {
    const VBRI = {};
    const view = new Uint8Array(buffer, 36);
    const binary = kk.i8ArrayTo2(view);
    let offset = 0;

    const get = (length) => {
        let bin_offset = offset * 8;
        let bin_length = length * 8;
        let value = parseInt(binary.substring(bin_offset, bin_offset + bin_length), 2);

        offset += length;
        return value;
    }

    if (view[0] === 86, view[1] === 66, view[2] === 82, view[3] === 73) {
        VBRI.name = 'VBRI'; offset += 4;

        VBRI.version = get(2);        //  4
        VBRI.delay = get(2);          //  6
        VBRI.quality = get(2);        //  8
        VBRI.bytes = get(4);          // 10
        VBRI.frames = get(4);         // 14
//        VBRI.table_size = get(2);     // 18 TOC
//        VBRI.table_scale = get(2);    // 20 TOC
//        VBRI.entry_bytes = get(2);    // 22
//        VBRI.entry_frames = get(2);   // 24

//        VBRI.table_length = VBRI.table_size * VBRI.entry_bytes;

        return VBRI;
    }
}
