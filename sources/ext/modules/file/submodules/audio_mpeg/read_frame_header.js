sub.read_frame_header = buffer => {
    const view = new Uint8Array(buffer);
    const string = kk.i8ArrayToString(view);
    const binary = kk.i8ArrayTo2(view);
    const MPEG = {};

    // 1       2           3           4            // 4 bytes
    // AAAAAAAAAAA BB CC D EEEE FF G H II JJ K L MM
    // 11111111111 11 01 1 1001 00 0 0 01 10 0 1 00 // 32 bits

    // A — Frame sync

    // B — MPEG Audio version ID
    const mpeg_version_index = parseInt(binary.slice(11, 13), 2);
    MPEG.mpeg_version = [2.5, 0, 2, 1][mpeg_version_index];

    // С — Layer description
    MPEG.layer = {
        '00': 0,
        '01': 3,
        '10': 2,
        '11': 1
    }[binary.slice(13, 15)];

    // D — Protection bit
//    MPEG.CRC = !parseInt(binary.slice(15, 16), 2);
//    if (MPEG.CRC)
//        MPEG.CRC = binary.slice(32, 48);

    // E — Bitrate index
    const bitrate_index = parseInt(binary.slice(16, 20), 2);
    // FIXME: Что за 15-й индекс?
//    if (bitrate_index == 15) {
//        sub.warn('BAD bitrate_index >', MPEG);
//    }

    if (MPEG.mpeg_version === 1) {
        MPEG.bitrate = [
            [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0],
            [0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
            [0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0]
        ][MPEG.layer - 1][bitrate_index];

    } else if (MPEG.mpeg_version === 2 || MPEG.mpeg_version === 2.5) {
        MPEG.bitrate = [
            [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0],
            [0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0],
            [0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0]
        ][MPEG.layer - 1][bitrate_index];
    }

    // F — Sampling rate frequency
    const frequency_index = parseInt(binary.slice(20, 22), 2);

    MPEG.sampling_rate = [
        [11025, 12000, 8000],
        [44100, 48000, 32000], // Резерв
        [22050, 24000, 16000],
        [44100, 48000, 32000]
    ][mpeg_version_index][frequency_index];

    // G — Padding bit
    // Padding is used to exactly fit the bitrate.As an example: 128kbps 44.1kHz layer II
    // uses a lot of 418 bytes and some of 417 bytes long frames to get the exact 128k bitrate.
    // For Layer I slot is 32 bits long, for Layer II and Layer III slot is 8 bits long.
    MPEG.padding_bit = parseInt(binary.slice(22, 23));

    // H — Private bit. This one is only informative.
    MPEG.private_bit = parseInt(binary.slice(23, 24));

    // I — Channel Mode
    // Note: Dual channel files are made of two independant mono channel.
    // Each one uses exactly half the bitrate of the file. Most decoders output them as stereo,
    // but it might not always be the case.
    // One example of use would be some speech in two different languages carried in the same
    // bitstream, and then an appropriate decoder would decode only the choosen language.
    MPEG.channel_mode = parseInt(binary.slice(24, 26), 2);
    // ['Stereo', 'Joint stereo (Stereo)', 'Dual channel (Stereo)', 'Single channel (Mono)'];

    // J — Mode extension (Only used in Joint stereo)
    // K — Copyright
    // L — Original
    // M — Emphasis
//    MPEG.emphasis = [false, '50/15 ms', false, 'CCIT J.17'][parseInt(binary.slice(30, 32), 2)];

    if (MPEG.mpeg_version === 1)
        MPEG.samples_per_frame = [384, 1152, 1152][MPEG.layer - 1];
    else if (MPEG.mpeg_version === 2)
        MPEG.samples_per_frame = [384, 1152, 576][MPEG.layer - 1];
    else if (MPEG.mpeg_version === 2.5)
        MPEG.samples_per_frame = [384, 1152, 576][MPEG.layer - 1];


    if (MPEG.method)
        console.log('ALREADY', MPEG.method);

    let Xing = sub.read_Xing(buffer, MPEG);
    if (Xing === false) {
        MPEG.method = 'CBR'; // Info Tag
        return MPEG;
    }

    if (kk.is.o(Xing)) {
        MPEG.method = Xing;
        return MPEG;
    }

    let VBRI = sub.read_VBRI(buffer, MPEG);
    if (kk.is.o(VBRI)) {
        MPEG.method = VBRI;
    } else {
        MPEG.method = 'CBR';
    }

    return MPEG;
}

// http://www.codeproject.com/Articles/8295/MPEG-Audio-Frame-Header
// http://gabriel.mp3-tech.org/mp3infotag.html
// http://id3.org/id3v2.4.0-frames // MLLT

// Возвращает искомую точку (в байтах) используя таблицу содержимого (TOC);
// percent — искомое время в процентах от общего времени. Может быть дробным.
//sub.seek_point = (TOC, bytes, percent) => {
//    // interpolate in TOC to get file seek point in bytes
//
//    if (percent < 0) percent = 0;
//    if (percent > 100) percent = 100;
//
//    let int = Math.floor(percent);
//
//    if (int > 99) int = 99;
//
//    let fa = TOC[int];
//    let fb;
//    if (int < 99) {
//        fb = TOC[int + 1];
//    } else {
//        fb = 256;
//    }
//
//    let fx = fa + (fb - fa) * (percent - int);
//
//    const seekpoint = Math.floor( ((1/256) * fx * bytes) );
//
//    return seekpoint;
//}
