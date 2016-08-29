(function(ext) {

const utils = {};

// TODO: в KK
utils.format_filesize = function(size) {
    var units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ']; // FUTURE: i18n

    return each (units, function(unit, index) {
        var output;
        var limit = Math.pow(10, 3 * (index + 1));

        if (size < limit * 0.8) {
            if (size < limit * 0.02)
                output = Math.round(size / limit * 10000) / 10
            else
                output = Math.round(size / limit * 1000);

            output = output.toLocaleString();
            output += ' ' + unit;
            return output;
        }
    });
}





utils.choose_a_locale = function(options) {
    var ui_language = chrome.i18n.getUILanguage();

    if (typeof options == 'object') {
        if (options[ui_language]) {
            return options[ui_language];
        } else if (options.ru) {
            return options.ru;
        } else {
            for (key in options) {
                return options[key];
            }
        }
    }
}




utils.is_url_exists = url => new Promise((resolve, reject) => {
    if (!kk.is_s(url))
        throw 'utils.is_url_exists: url is\'nt string';

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
    xhr.send();
});

core.utils = utils;

})(ext);
