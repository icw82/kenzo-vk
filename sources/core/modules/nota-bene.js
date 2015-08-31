(function(kzvk) {
'use strict';

var mod = new kzvk.Module('noname');

// CONTENT
mod.init.content = function() {

}

// BACKGROUND
mod.init.background = function() {

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);


// --------------------------------------
(function(kzvk) {
'use strict';

var mod = kzvk.modules.noname;

mod.init.content = function() {

}

})(kzvk);


// element, node — обязательно DOM Element
// item — элемент списка.

//    "browser_action": {
//        "default_icon": {
//            "19": "icons/19.png",
//            "38": "icons/38.png"
//        }
//    },

//    chrome.tabs.query({url: [
//        "*://vk.com/*",
//        "*://*.vk.com/*",
//        "*://*.vk.me/*"
//    ]}, function(tabs) { console.log(tabs)})
