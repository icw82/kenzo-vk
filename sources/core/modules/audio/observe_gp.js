(function(kzvk){
'use strict';
//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

var mod = kzvk.modules.audio;

var gp = {
    dom: {},
    complete: false
};

var public_key = kenzo.rand(10);

// Регистрация и Отлов изменений глобального плеера
mod.observe_gp = function(element){
    //console.log('--observe_gp!');

    if (!(element instanceof Element))
        return false;

    if (gp.dom.self instanceof Element)
        return false;

    gp.dom.self = element;

    var provider = document.createElement('script');
    provider.setAttribute('src', chrome.extension.getURL('scripts/provider-audio.js'));
    provider.setAttribute('id', 'kenzo-vk__provider-audio');
    provider.setAttribute('data-ext-id', chrome.runtime.id);
    provider.setAttribute('data-pub-key', public_key);
    mod.dom.body.appendChild(provider);

    var observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            // Если плеер ещё не создан полностью
//            if (!gp.complete){
                if (mr.target.getAttribute('id') === 'gp_play_btn'){
                    gp.dom.button = mr.target;
                } else if (mr.target.getAttribute('id') === 'gp_performer'){
                    gp.dom.performer = mr.target;
                } else if (mr.target.getAttribute('id') === 'gp_title'){
                    gp.dom.title = mr.target;
                }
//            } else {
//                //console.log('---mr', mr.type, mr);
//
//                if (mr.type === 'attributes'){
//                    //console.log('---mr', mr);
//                    //attributeName: "class"
//                } else {
//                    //console.log('---mr***', mr);
//
//                };
//
//                //console.log('---doms', gp.dom);
//            }

        });

        if (
//            !gp.complete &&
            (gp.dom.button instanceof Element) &&
            (gp.dom.performer instanceof Element) &&
            (gp.dom.title instanceof Element)
        ){
            //gp.complete = true;
            observer.disconnect();

            //mod.observe_gb_button();
        }

//        each (changes, function(ch){
//            each (goals, function(goal){
//                if (goal.item === ch.object){
//                    if (goal.changes.indexOf(ch.name) === -1)
//                        goal.changes.push(ch.name);
//                    return true;
//                }
//            }, function(){
//                goals.push({
//                    item: ch.object,
//                    changes: [ch.name]
//                });
//            }, true);
//        });
//
//        if (goals.length > 0){
//            each (goals, function(goal){
//                mod.update_button(goal.item, goal.changes);
//            });
//        }
    });

    observer.observe(gp.dom.self, {childList: true, subtree: true, attributes: true});
}

mod.observe_gb_button = function(){
    var observer = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            if (mr.type === 'childList'){
                console.log('-- ADD', mr);

            } else if (mr.type === 'attributes'){
                console.log('-- ATTR', mr);

            }
        })

    });

    observer.observe(gp.dom.button, {childList: true, subtree: true, attributes: true});
}

//<div id="gp" class="fixed reverse"
//    style="display: block; top: auto; width: 154px; bottom: 20px; left: 67px;">
//    <div class="wrap"
//        onmouseover="addClass(this, 'over');"
//        onmouseout="removeClass(this, 'over');">
//        <div id="gp_back" style="width: 154px;">
//            <div><!-- --></div>
//        </div>
//        <div id="gp_wrap">
//            <div class="audio" id="audio_global">
//                <div id="gp_small">
//                    <div id="gp_play_btn" class="fl_l">
//                        <a onmousedown="cancelEvent(event)"
//                            onclick="playAudioNew('170344789_335649331', false)">
//                            <div class="gp_play_wrap">
//                                <div id="gp_play" class=""></div>
//                            </div>
//                        </a>
//                    </div>
//                    <div id="gp_info" class="fl_l"
//                        onmouseover="if (!vk.id) return; Pads.preload('mus')"
//                        onclick="if (!vk.id) return; window._pads.gpClicked = true; Pads.show('mus', event)">
//                        <div id="gp_performer">dZihan &amp; Kamien</div>
//                        <div id="gp_title">Homebase</div>
//                    </div>
//                </div>
//            </div>
//        </div>
//    </div>
//</div>


//mod.global_player_event_listener = function(){
//    mod.dom_element.global_player.addEventListener('DOMNodeInserted', function(event){
//        if (
//            (event.target instanceof Element) &&
//            (event.target.localName == 'a') &&
//            (event.target.querySelector('#gp_play'))
//        ){
//            var onclick_instructions = event.target.getAttribute('onclick'),
//                matches = onclick_instructions.match(/playAudioNew\('(.+?)'/);
//
//            if (matches[1] && (matches[1] != kzvk.globals.now_playing)){
//                chrome.storage.local.set({'audio':{'now_playing': matches[1]}});
//            }
//
//        }
//    });
//}

})(kzvk);
