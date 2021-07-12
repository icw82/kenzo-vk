mod.init__content = () => {
    core.events.on_content_loaded.addListener(() => {
        document.body.setAttribute('id', 'kz-ext');

        mod.ext.dom.vk = {
            header: document.body.querySelector('#page_header_cont'),
            sidebar: document.body.querySelector('#side_bar'),
            body: document.body.querySelector('#page_body'),
            footer: document.body.querySelector('#footer_wrap')
            //narrow_column_wrap
        }

        if (mod.ext.options.debug._ && mod.ext.options.debug.styles) {
            kk.class_forever('kzvk-debug', document.body);
        }

        mod.ext.dom.overlay = document.createElement('div');
        mod.ext.dom.overlay.classList.add('kzvk-overlay');

        document.body.appendChild(mod.ext.dom.overlay);

        mod.ext.modules.provider.get('vk').then(response => {
            mod.ext.host_data.vk = response;
            mod.on_loaded.dispatch();
        }, error => {
            console.error(error);
        });

        mod.on_loaded.dispatch();
    });
}
