function choose_a_locale(options) {
    var ui_lanuage = chrome.i18n.getUILanguage();

    if (typeof options == 'object') {
        if (options[ui_lanuage]) {
            return options[ui_lanuage];
        } else if (options.ru) {
            return options.ru;
        } else {
            for (key in options) {
                return options[key];
            }
        }
    }
}

var default_options = {
    audio: true,
    audio__cache: true,
    audio__separator: choose_a_locale({
        en: '–',
        ru: '—'
    }),
    audio__progress_bars: true,
    audio__simplified: false,

    video: true,
    video__progress_bars: true,
    video__simplified: false,

    scrobbler: false,
    scrobbler__proportion: 50,
    scrobbler__4m: true,

    trash: true,
    trash__lsb__ad: true,
    trash__lsb__fr: true,
    trash__group_recom: true,
    trash__newsads: true,
    trash__promoted_posts: false,
    trash__profile_rate: true,
    trash__big_like: false,
    trash__user_reposts: false,
    trash__group_reposts: false,

    filters: true,
    filters__square_brackets: true,
    filters__curly_brackets: true,

    ui: true,
    ui__kzvk_button: true,

    debug: false,
    debug__mode: false
}

var default_globals = {
    base: {
        keys: []
    },
    audio: {
        now_playing: null
    },
    downloads: {
        history: [],
        current: []
    },
    scrobbler: {
        session: null,
        buffer: []
    }
}
