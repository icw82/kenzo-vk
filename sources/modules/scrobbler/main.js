(function(kzvk){
'use strict';

var mod = new kzvk.Module('scrobbler');

mod.api_url = 'http://ws.audioscrobbler.com/2.0/';
mod.api_key = 'dc20a585f46d025a75b0efdce8c9957a';
mod.secret = '110ce7f7a6cec742c6433507428ebfc7';
mod.session = null;
mod.keys = [];

Object.defineProperty(mod, 'auth_url', {
    get: function () {
        return 'http://last.fm/api/auth?api_key=' +
            this.api_key + '&cb=' +
            chrome.runtime.getURL('options/template.html');
    }
});

mod.get_signature = function(params){
    var keys = [],
        string = '';

    for (let key in params){
        keys.push(key);
    }

    keys.sort();

    each (keys, function(key){
        string += key + params[key];
    });

    string += mod.secret;

    return md5(string);
}

mod.get_encoded_params = function(params){
    var pairs = [];

    for (let key in params){
        pairs.push(key + '=' + encodeURIComponent(params[key]));
    }

    return pairs.join('&');
}

mod.request = function(params, callback, post){
    if (typeof params != 'object')
        params = {}

    if (typeof params.method != 'string'){
        console.warn('Метод не задан');
        return false;
    }

    params.api_key = mod.api_key;
    if (mod.session !== null) {
        if (!mod.session)
            console.warn('//mod.session', mod.session);
        else
            params.sk = mod.session.key;
    }
    params.api_sig = mod.get_signature(params);
    params.format = 'json';

    if (post) {
        mod.xhr(mod.api_url, mod.get_encoded_params(params), callback, true);
    } else {
        var url = mod.api_url + '?' + mod.get_encoded_params(params);
        mod.xhr(url, null, callback);
    }
}

mod.xhr = function(url, params, callback, post){
    var xhr = new XMLHttpRequest();

    //console.log('— params:', params);

    if (post)
        xhr.open('POST', url, true);
    else
        xhr.open('GET', url, true);

    xhr.onreadystatechange = function(){
        if (xhr.readyState !== 4) return false;
        if (xhr.status === 200){
            var self = this;

            //console.log('— self.response:', self.response);

            if (typeof callback == 'function') {
                if (self.response.error){
                    if (self.response.error == 9) {
                        if (mod.session !== null) {
                            mod.reset_session();
                            console.log(mod.session);
                        }
                    } else {
                        console.log('— error:', self.response);
                        console.log('— request:', params);
                        // 14 This token has not been authorized
                    }
                }

                callback(self.response);
            }
        }
    }

    xhr.responseType = 'json';

    if (post) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        xhr.send(params);
    } else {
        xhr.send(null);
    }
}

mod.reset_session = function(){
    chrome.storage.local.get('scrobbler', function(storage){
        storage.scrobbler.session = null;

        chrome.storage.local.set(storage, function(){
            console.log('сессия сброшена');
        });
    });
}

/*

Проблема в том, что chrome.storage.onChanged следит только за объектами первого уровня.
Не целесообразно хранить данные в больших объектах, их нужно дробить.
Например:
    scrobbler {
        buffer: […],
        session: {…}
    }
нужно заменить на:
    scrobbler__buffer = [];
    scrobbler__session = {};

Минус в том, что прослушку нужно вешать на несколько объектов, вместо одного.

*/
mod.observe = function(){
    function observer(changes, areaName){
        if ((areaName == 'local') && ('scrobbler' in changes)){
            //console.log('**changes', changes);

            if (changes.scrobbler.newValue.session !== mod.session)
                mod.session = changes.scrobbler.newValue.session;

            //console.log('observe - scrobbler.session', mod.session);
        }
    }

    chrome.storage.local.get('scrobbler', function(storage) {
//        console.log('***', storage)
        mod.session = storage.scrobbler.session;
        chrome.storage.onChanged.addListener(observer);
    });
}


// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
