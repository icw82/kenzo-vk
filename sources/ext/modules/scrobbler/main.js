mod.defaults.buffer = [];
mod.defaults.session = {};
mod.defaults.options = {
    _: false,
    proportion: 50,
    m4m: true,
    name_filter: true
}

mod.api_url = 'http://ws.audioscrobbler.com/2.0/';
mod.api_key = 'dc20a585f46d025a75b0efdce8c9957a';
mod.auth_url = 'http://last.fm/api/auth?api_key=' +
    mod.api_key + '&cb=' + chrome.runtime.getURL('layouts/options.html');
mod.secret = '110ce7f7a6cec742c6433507428ebfc7';

mod.session = null;

mod.init__background = () => {
    if (mod.options._ !== true)
        return;

    core.events.on_audio_play.addListener(status => {
//        mod.center(status);
    });

//    mod.observe();

    mod.on_loaded.dispatch();
}

//mod.observe = function() {
//    function observer(changes, namespace) {
//        if ((namespace == 'local') && ('scrobbler__session' in changes)) {
//            if (
//                mod.session === null ||
//                changes.scrobbler__session.newValue.key !== mod.session.key
//            )
//                mod.session = changes.scrobbler__session.newValue;
//        }
//    }
//
//    chrome.storage.local.get('scrobbler__session', function(storage) {
//        //mod.log('storage', storage);
//        mod.session = storage.scrobbler__session;
//        chrome.storage.onChanged.addListener(observer);
//    });
//}


//FUTURE: (скробблинг) Индикация прогресса.
//FUTURE: (скробблинг) Кнопка в избранное.
//FUTURE: (скробблинг) История скроблинга для неавторизированных;
