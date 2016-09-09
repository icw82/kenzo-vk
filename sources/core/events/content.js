{
    const key = kk.generate_key(10);

    core.events.on_content_loaded = new kk.Event(key);

    let on_loaded = () => {
        document.removeEventListener('DOMContentLoaded', on_loaded);
        window.removeEventListener('load', on_loaded);
        core.events.on_content_loaded.complete();
    }

    if (document.readyState === 'complete') {
        core.events.on_content_loaded.complete();

    } else {
        document.addEventListener('DOMContentLoaded', on_loaded, false);
        window.addEventListener('load', on_loaded, false);
    }
}
