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


utils.local_console = function() {
    if (typeof arguments[0] !== kk._o || typeof arguments[1] !== kk._s) {
        kk.__a;
        return;
    }

    let object = arguments[0];
    let prefix = '';
    if (arguments[1])
        prefix += arguments[1] + ' (' + ext.s + ') —';

    each (['log', 'info', 'warn', 'error'], function(method) {
        object[method] = function() {
            if (ext.options && !ext.options.debug__log)
                return;

            console[method].apply(this, add_prefix(arguments));
        }
    });

    object.flood = function() {
        if (ext.options && !ext.options.debug__flood)
            return;

        console.log.apply(this, add_prefix(arguments));
    }


    function add_prefix(args) {
        args = Array.prototype.slice.call(args);
        args.unshift(prefix);
        return args;
    }
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


utils.inject_to_DOM = function(type, url) {
    // Встраивание
    if (!['js', 'svg', 'css'].includes(type))
        return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return false;
        if (xhr.status === 200) {

            if (type === 'svg') {
                var container = document.createElement('div');
                container.style.display = 'none';
            } else if (type === 'js') {
                var container = document.createElement('script');
            } else if (type === 'css') {
                var container = document.createElement('style');
            }

            container.innerHTML = this.response;
            document.head.appendChild(container);
//            console.log('inject_to_DOM', url)
        }
    }

    xhr.send(null);
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

utils.object_to_flat = object => {
    const list = {};
    const flat = (source, prefix) => {
        for (let key in source) {
            let path = '';

            if (kk.is_s(prefix))
                path += prefix + '.' + key;
            else
                path += key;

            if (kk.is_o(source[key])) {
                flat(source[key], path)
            } else {
                list[path] = source[key];
            }
        }
    }

    flat(object);

    return list;
}

utils.flat_to_object = flat => {
    const object = {};

    for (let path in flat) {
        let splited_path = path.split('.');
        let current = object;

        each (splited_path, (key, i) => {

            if (i < splited_path.length - 1) {
                if (!kk.is_o(current[key])) {
                    current[key] = {};
                }

                current = current[key];
            } else {
                current[key] = flat[path];
                console.log(path, flat[path]);
            }
        });
    }

    return object;
}

ext.utils = utils;

})(ext);
