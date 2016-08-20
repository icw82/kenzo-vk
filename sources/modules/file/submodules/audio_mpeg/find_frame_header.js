sub.find_frame_header = buffer => {
    let view = new Uint8Array(buffer);

    let index = each (view, (byte, i) => {
        if (view.length - i < sub.required_lenth_of_frame_header)
            return false;

        if (byte === 255) {
            let next = kk.i8to2(view[i + 1]);
            if (
                next.slice(0, 3) === '111' &&
                next.slice(3, 5) !== '01' &&
                next.slice(5, 7) !== '00' &&
                next.slice(22, 24) !== '10'
            ) {
                 return i;
            }
        }
    });

    return kk.is_n(index) ? index : false;
}
