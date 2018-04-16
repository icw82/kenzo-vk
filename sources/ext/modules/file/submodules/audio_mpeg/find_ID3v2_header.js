sub.find_ID3v2_header = buffer => {
    let view = new Uint8Array(buffer);

    let index = each (view, (byte, i) => {
        if (byte !== 73 ||
            view[i + 1] !== 68 ||
            view[i + 2] !== 51
        ) return;

        if (
            view[i + 6] < 128 &&
            view[i + 7] < 128 &&
            view[i + 8] < 128 &&
            view[i + 9] < 128
        ) return i;

        return;
    });

    return kk.is.n(index) ? index : false;
}
