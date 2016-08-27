'use strict';

const ext = (function() {

    // DEFAULTS
    {
        let options = {
            filters: true,
            filters__square_brackets: true,
            filters__curly_brackets: true,
            download_button__simplified: false
        }

        ext.defaults = {
            base: {
                keys: []
            },
            downloads: [],
            downloads__history: [],
            downloads__count: 1,
            scrobbler__buffer: [],
            scrobbler__session: {}
        }
    }

    return ext;

})();
