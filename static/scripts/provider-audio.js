(function(root){

var tag = document.body.querySelector('#kenzo-vk__provider-audio');
if (!tag) return false;
//var id = tag.getAttribute('data-ext-id');
document.body.removeChild(tag);

return false; // NOTE: отключено

if (typeof audioPlayer === 'object'){
    //console.log(audioPlayer);

//    Object.observe(audioPlayer, function(changes){
//        try { // FIXME: временно для отлова ошибок внутри Object.observe();
//            ap_observer(changes);
//        } catch (error) {
//            console.error(error);
//        }
//    });
}

var ap_observer = function(changes){
    var added = 0,
        deleted = 0;

    //chrome.runtime.sendMessage(id, {ap_changes: changes});

//    console.log('** changes:', changes);
//
//    each (changes, function(ch){
//        if (ch.type == 'add'){
//            console.log('** add:', ch);
//            added++;
//        } else if (ch.type == 'update'){
//            if (ch.name != 'length')
//                console.log('** update:', ch);
//        } else {
//            //deleted++
//            //console.log('**** delete:', ch);
//        }
//    });
}

})(window);
