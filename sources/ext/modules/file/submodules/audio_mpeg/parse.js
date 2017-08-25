sub.parse = (input) => new Promise((resolve, reject) => {
    if (kk.is_s(input)) {
        sub.parse_by_url(input).then(resolve, reject);
    } else if (kk.is_o(input)) {
        sub.parse_by_object(input).then(resolve, reject);
    } else {
        throw 'file.audio_mpeg: incorrect argument';
    }

});

sub.parse_by_url = (url) => new Promise((resolve, reject) => {
     mod.get__headers(url).then(result => {
        mod.log('> 2 >>>>>', url);
        sub.parse_by_object(result).then(resolve, reject);
    }, reject);
});

sub.parse_by_object = (data) => new Promise((resolve, reject) => {
    sub.read_the_first_expected_headers(data)
        .then(sub.find_headers, reject)
        .then(resolve, reject);
});

// TODO: Вырезка из контента для хэша
// TODO: Для других типов тоже нужна вырезка.
// TODO: Учитывать наличие id1.
//    let slice;
//
//    if (data.content_length > 128) {
//        let center = data.tag_length + Math.round( data.content_length/2 );
//        slice = [center - 64, center + 63];
//    } else {
//        slice = [data.tag_length, data.content_length];
//    }
//
//    console.log(base.url);
//    console.log('slice', slice);
//    // Хэш
//    data.hash =
//        md5( new Uint8Array(response[1].content,  0, 64) ) +
//        md5( new Uint8Array(response[1].content, 64, 64) );
