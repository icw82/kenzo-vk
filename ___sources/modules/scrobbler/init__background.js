mod.init__background = function() {
    if (mod.options._ !== true)
        return;

    var status = ext.modules['status'];

    status.on_audio_play.addListener(function() {
        mod.center(status.audio__info);
    });

    mod.observe();

    mod.on_loaded.dispatch();
}
