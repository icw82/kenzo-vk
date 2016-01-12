mod.downloads_listner = function(delta) {
    var id = delta.id;

    //mod.log('downloads_listner:', delta);

    if (delta.filename) {
        mod.watch.start();
    } else if (delta.endTime) {
        mod.log('Download complete', id);
    } else if (delta.paused) {
        if (delta.paused.current)
            mod.log('Paused');
        else
            mod.log('Resume');
    }
}
