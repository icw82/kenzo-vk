function init__content() {

    var on_content_load = new Promise(ext.promise__content_load);

    on_content_load.then(function() {
        document.body.setAttribute('id', 'kz-ext');
        ext.dom.vk = {
            header: document.body.querySelector('#page_header_cont'),
            sidebar: document.body.querySelector('#side_bar'),
            body: document.body.querySelector('#page_body'),
            footer: document.body.querySelector('#footer_wrap')
            //narrow_column_wrap
        }
    });
}
