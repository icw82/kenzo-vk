mod.methods = {
    auth: {},
    track: {}
};

mod.methods.auth.getSession = token => new Promise((resolve, reject) => {
//    mod.storage.session = null;
//    ext.save_storage('auth.getSession');

    const params = {
        method: 'auth.getSession',
        token: token
    }

    mod.request(params, true).then(response => {
        if (!kk.is.o(response))
            return;

        mod.storage.session = response.session;
        core.storage.save('getSession');

    }, reject);
});

mod.methods.track.updateNowPlaying = params => new Promise((resolve, reject) => {
    params.method = 'track.updateNowPlaying';

    mod.request(params, true).then(response => {
        if (!kk.is.o(response))
            return;

        resolve(response);

    }, reject);
});

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
