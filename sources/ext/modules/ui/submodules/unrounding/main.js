// Раскругление
sub.init__content = () => {
    console.log('init__content >>');

    if (ext.mode === 2016) {
        core.events.on_content_loaded.addListener(() => {
            if (mod.options.unrounding) {
                kk.class_forever('kzvk-ui-unrounding', document.body);
            }
        });
    }
}
