// Раскругление
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_content_loaded.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.unrounding) {
                kk.class_forever('kzvk-ui-unrounding', document.body);
            }
        });
    }
}
