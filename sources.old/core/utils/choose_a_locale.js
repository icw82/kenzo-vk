core.utils.choose_a_locale = options => {
    const ui_language = browser.i18n.getUILanguage();

    if (kk.is.o(options)) {
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
