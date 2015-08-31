(function(kzvk) {
'use strict';

var mod = kzvk.modules.downloads;

mod.downloads_listner = function(delta){
    var id = delta.id;

    //console.log('downloads_listner:', delta);

    if (delta.filename){
        mod.watch.start();
    } else if (delta.endTime){
        console.log('Download complete', id);
    } else if (delta.paused){
        if (delta.paused.current)
            console.log('Paused');
        else
            console.log('Resume');
    }
}

})(kzvk);
