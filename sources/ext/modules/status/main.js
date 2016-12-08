mod.init__content = () => {
    core.events.on_content_loaded.addListener(() => {
        mod.ext.dom.header = document.body.querySelector('#page_header_cont');
        mod.ext.dom.content = document.body.querySelector('#page_body');
        mod.ext.dom.side_bar = document.body.querySelector('#side_bar');

        mod.on_loaded.dispatch();
    });
}

mod.init__background = () => {
    mod.on_loaded.dispatch();

}
