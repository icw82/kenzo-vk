(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = {
    name: 'audio',
    version: '1.0.0'
};

mod.body_observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        if (!mod.dom.body.classList.contains('kz-vk-audio'))
            mod.dom.body.classList.add('kz-vk-audio');
    });
});

// Отлов изменений в DOM
mod.document_listner = function(event){
    if (event.target instanceof Element){
        if (event.target.classList.contains('audio')){
            //mod.process(event.target);
            return true;
        }

        if (event.target.classList.contains('area')){
            if (event.target.parentElement.classList.contains('audio')){
                //mod.process(event.target.parentElement);
                return true;
            }
        }

        //console.log('mutate', event.target);

//        var audio = event.target.querySelectorAll('.audio');
//
//        if (audio.length > 0){
//            each (audio, function(item){
//                process(item);
//            });
//            return true;
//        }
//
//        // инициируется один раз
//        if (!mod.dom.global_player){
//            if (event.target.getAttribute('id') === 'gp'){
//                mod.dom.global_player = event.target;
//                mod.global_player_event_listener();
//                return true;
//            }
//        }
    }
}

// Отлов изменений плеера (?)
mod.global_player_event_listener = function(){
    mod.dom.global_player.addEventListener('DOMNodeInserted', function(event){
        if (
            (event.target instanceof Element) &&
            (event.target.localName == 'a') &&
            (event.target.querySelector('#gp_play'))
        ){
            var onclick_instructions = event.target.getAttribute('onclick'),
                matches = onclick_instructions.match(/playAudioNew\('(.+?)'/);

            if (matches[1] && (matches[1] != kzvk.globals.now_playing)){
                chrome.storage.local.set({'audio':{'now_playing': matches[1]}});
            }

        }
    });
}

mod.process = function(){

}

mod.init = function(){
    mod.dom = {
        body: document.querySelector('body'),
        global_player: document.querySelector('#gp')
    }

    mod.dom.body.classList.add('kz-vk-audio');

    mod.body_observer.observe(mod.dom.body, {attributes: true /*MutationObserverInit*/});
    //mod.body_observer.disconnect();

    // Обработка уже имеющихся аудиозаписей на странице
    each (document.querySelectorAll('.audio'), function(item){
        mod.process(item);
    });

    document.addEventListener('DOMNodeInserted', mod.document_listner);

//    chrome.storage.local.get(default_globals, function(storage){
//        kzvk.globals.now_playing = storage.audio.now_playing;
//    });
//
//    if (mod.dom.global_player)
//        mod.global_player_event_listener();
//
//    // Индикатор загрузки играющего трека
//    kzvk.globals.vk_load = null;

/*
    #pd_load_line
    ac_load_line
    audio_progress_line
*/

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
