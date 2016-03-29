ext.filter = (function() {
    var _ = {};

    _.base = function(string) {
        if (typeof string !== 'string') {
            console.warn('not string')
            return string;
        }

        string = he.decode(string);
        return string.trim();
    };

    _.trash = function(string) {
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

    _.file_name = function(string) {
        if (string.length === 0) {
            string = chrome.i18n.getMessage('mistake');
        }

        string = string.replace(/[\\\/:\*\?\"<>\|\+~]/g, ' ');

        string = _.trash(string);

        return string.trim();

    }

    return _;

})();
