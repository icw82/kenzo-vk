core.utils.is_url_exists = url => new Promise((resolve, reject) => {
    if (!kk.is.s(url))
        throw 'is_url_exists: url is\'nt string';

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.HEADERS_RECEIVED || xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject();
            }
        }
    });

    xhr.open('HEAD', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.send();
});
