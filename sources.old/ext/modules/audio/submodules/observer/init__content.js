sub.init__content = () => {
    const key = kk.generate_key(15);
    const init_time = Date.now();

    const args = {
        key: key,
        init_time: init_time,
        origin: window.location.origin,
        ext_id: browser.runtime.id,
        root_url: browser.extension.getURL('/'),
        full_name: mod.full_name,
        debug: ext.options.debug.log
    }

    core.utils.inject_isolated_function_to_dom(
        sub.isolated_function,
        args
    );
}
