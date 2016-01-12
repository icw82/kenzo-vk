mod.init__content = function() {

    ext.dom.header = ext.dom.body.querySelector('#top_nav');
    ext.dom.content = ext.dom.body.querySelector('#page_body');
    ext.dom.side_bar = ext.dom.body.querySelector('#side_bar');

    mod.location.start();
    mod.content.start();

//    mod.parse_content = function() {
////        mod.log('** parse_content');
//    }

    mod.dispatch_load_event();
}
