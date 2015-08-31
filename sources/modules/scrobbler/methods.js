(function(kzvk){
'use strict';

var mod = kzvk.modules.scrobbler;

mod.methods = {
    auth: {},
    track: {}
};

mod.methods.auth.getSession = function(token, callback){
    mod.session = null;

    var params = {
        method: 'auth.getSession',
        token: token
    }

    kzvk.modules.scrobbler.request(params, function(response){
        if (typeof response.session == 'object'){
            //console.log('** response.session.key', response.session.key);

            mod.session = response.session;
            console.log('mod.methods.auth.getSession ** mod.session', mod.session);

            chrome.storage.local.get('scrobbler', function(storage){
                storage.scrobbler.session = response.session;
                chrome.storage.local.set(storage, function(){
                    if (typeof callback == 'function')
                        callback();
                });
            });
        }
    });
}

mod.methods.track.updateNowPlaying = function(params, callback){
    if (typeof params !== 'object'){
        console.warn('Параметры не заданы')
        return false;
    }

    params.method = 'track.updateNowPlaying';

    kzvk.modules.scrobbler.request(params, function(response){
        // console.log('updateNowPlaying:', response);

        if (typeof callback == 'function')
            callback(response);

    }, true);
}

mod.methods.track.scrobble = function(params, callback){
    if (typeof params !== 'object'){
        console.warn('Параметры не заданы')
        return false;
    }

    params.method = 'track.scrobble';

    kzvk.modules.scrobbler.request(params, function(response){
        console.log('track.scrobble:', response);

        if (typeof callback == 'function')
            callback(response);

    }, true);
}

})(kzvk);
