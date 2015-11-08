//TODO: Возраст, если известна дата.

mod.user_id = function() {
    //TODO: id в шапке профиля.

    if (mod.options.ids !== true) return;

//https://api.vk.com/method/users.get?user_ids=

//    <div id="header_wrap2">
//        <div id="header_wrap1">
//          <div id="header">
//            <h1 id="title"> ** </h1>
//          </div>
//        </div>
//      </div>

}

//TODO: у постов, открыть в новой вкладке.
mod.post_in_a_new_tab = function() {
    if (ext.options.ui__new_tab_buttons !== true) return;

}

mod.kzvk_button = function() {
    if (ext.options.ui__kzvk_button !== true) return;
//        var menu = ext.dom.side_bar.querySelector('ol');
//
//        // Разделитель
//        var delimiter = document.createElement('div');
//        delimiter.classList.add('more_div');
//        menu.appendChild(delimiter);
//
//        // Кнопка
//        var item = document.createElement('li');
//        var url = chrome.runtime.getURL('options/template.html');
//        item.innerHTML =
//            '<a href="' + url + '" class="left_row" target="_blank">' +
//                '<span class="left_label inl_bl">' +
//                    chrome.i18n.getMessage('ext_name') +
//                '</span>' +
//            '</a>';
//
//        menu.appendChild(item);
}

mod.init__content = function() {
    if (mod.options._ !== true) return;

    ext.dom.side_bar = document.querySelector('#side_bar');

    mod.user_id();
    mod.kzvk_button();

    mod.dispatch_load_event();
}
