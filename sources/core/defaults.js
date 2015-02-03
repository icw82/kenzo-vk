function choose_a_locale(options){
    var ui_lanuage = chrome.i18n.getUILanguage();

    if (typeof options == 'object'){
        if (options[ui_lanuage]){
            return options[ui_lanuage];
        } else if (options.ru){
            return options.ru;
        } else {
            for (key in options){
                return options[key];
            }
        }
    }
}

var default_options = {
    debug: false,

    audio: true,
    audio__cache: true,
    audio__vbr: true,
    audio__separator: choose_a_locale({
        en: '–',
        ru: '—'
    }),
    audio__progress_bars: true,
    audio__simplified: false,

    video: true,
    video__progress_bars: true,
    video__simplified: false,

    trash: true,
    trash__lsb__ad: true,
    trash__lsb__fr: true,
    trash__newsads: true,
    trash__group_recom: true,

    filters: true,
    filters__square_brackets: true,
    filters__curly_brackets: true
};

var default_globals = {
    'audio': {
        'now_playing': null
    },
    'downloads': {
        'history': [],
        'current': []
    }
};
