sub.read_ID3v1_header = buffer => {
    let view = new Uint8Array(buffer);
    let string = kk.i8ArrayToString(view);

    if (string == 'TAG') {
        return {
            length: 128
        }
    } else
        return false;
}
