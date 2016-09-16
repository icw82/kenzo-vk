mod.methods = {
    auth: {},
    track: {}
};

mod.methods.auth.getSession = token => new Promise((resolve, reject) => {
//    mod.storage.session = null;
//    ext.save_storage();

    const params = {
        method: 'auth.getSession',
        token: token
    }

    mod.request(params).then(response => {
        if (!kk.is_o(response))
            return;

        mod.storage.session = response.session;

        mod.log('mod.storage', mod.storage);
        mod.log('ext.storage.scrobbler', ext.storage.scrobbler);

        setTimeout(() => {
            mod.log('ext.storage.scrobbler', ext.storage.scrobbler);
            // Куда изчезает сессия, блять?
        }, 2000)

        ext.save_storage().then(() => {
            resolve();
        });
    }, reject);
});

mod.methods.track.updateNowPlaying = function(params, callback) {
    if (typeof params !== 'object') {
        mod.warn('Параметры не заданы')
        return false;
    }

    params.method = 'track.updateNowPlaying';

    ext.modules.scrobbler.request(params, function(response) {
        // mod.log('updateNowPlaying:', response);

        if (typeof callback == 'function')
            callback(response);

    }, true);
}

mod.methods.track.scrobble = function(params, callback) {
    if (typeof params !== 'object') {
        mod.warn('Параметры не заданы')
        return false;
    }

    params.method = 'track.scrobble';

    ext.modules.scrobbler.request(params, function(response) {
        mod.log('track.scrobble:', response);

        if (typeof callback == 'function')
            callback(response);

    }, true);
}
