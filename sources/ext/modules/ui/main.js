//mod.dependencies = [''];

mod.defaults.options = {
    _: true,
    ages: false, //TODO: Возраст, если известна дата.
    ids: false,
    original_image: true,
    post_in_new_tab: true, //TODO: у постов, открыть в новой вкладке.
    sidebar_button: false,
    unrounding: true
}

mod.init__content = () => {
    mod.on_loaded.dispatch();
}

//// TODO: унифицировать инструмент
//mod.make_row = function(label, content) {
//    var _ = {};
//
//    _.row = document.createElement('div');
//    if (ext.mode === 2016)
//        _.row.classList.add('profile_info_row');
//    else if (ext.mode === 2006)
//        _.row.classList.add('clear_fix');
//
//    _.row.classList.add('kzvk-ui-profile_info_row');
//
//    _.label = document.createElement('div');
//    _.label.classList.add('label');
//    _.label.classList.add('kzvk-ui-profile_info_row__label');
//    _.label.innerHTML = label;
//
//    _.content = document.createElement('div');
//    _.content.classList.add('labeled');
//    _.content.classList.add('kzvk-ui-profile_info_row__content');
//    _.content.innerHTML = content;
//
//    _.row.appendChild(_.label);
//    _.row.appendChild(_.content);
//
//    return _.row;
//}
