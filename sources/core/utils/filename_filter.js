core.utils.filter = {}

core.utils.filter.base = string => {
    if (!kk.is_s(string)) {
        console.error('base: not string');
        return string;
    }

    string = he.decode(string);
    return string.trim();
}

// TODO: удалять ссылки, сердечки, смайлики и прочую лабуду.

core.utils.filter.trash = string => {
    if (!kk.is_s(string)) {
        console.error('core.utils.filter.trash: not string');
        return string;
    }

    if (!ext || !ext.options) {
        console.error('core.utils.filter.trash: настройки не обнаружены');
        return string;
    }

    if (ext.options.filters__square_brackets === true) {
        string = string.replace(/\[.+?\]/g, '');
    }

    if (ext.options.filters__curly_brackets === true) {
        string = string.replace(/\{.+?\}/g, '');
    }

    // Повторяющиеся пробелы
    string = string.replace(/\s+/g, ' ');

    // Пробелы перед точкой
//        string = string.replace(/\s(\.\w+?)$/g, '$1');
    string = string.replace(/\s(\.)/g, '.');

    // Повторяющиеся точки
    string = string.replace(/\.{3,}/g, '…');
    string = string.replace(/\.\./g, '.');

    // Точка в начале строки
    string = string.replace(/^\./g, '');

    return string.trim();
}

core.utils.filter.file_name = string => {
    if (string.length === 0) {
        string = chrome.i18n.getMessage('mistake');
    } else {
        string = string.replace(/[\\\/:\*\?\"<>\|\+~]/g, ' ');
        string = _.trash(string);
    }

    return string.trim();
}
