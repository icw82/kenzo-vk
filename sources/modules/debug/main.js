(function(kzvk){
'use strict';

var mod = new kzvk.Module('debug');

mod.default_options = {
    _: false,
    styles: false,
    log: false,
    flood: false
}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
