'use strict';

const ext = (function() {

    // DEFAULTS
    {
        ext.defaults = {
            downloads: [],
            downloads__history: [],
            downloads__count: 1,
            scrobbler__buffer: [],
            scrobbler__session: {}
        }
    }

    return ext;

})();
