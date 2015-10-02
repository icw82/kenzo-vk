(function(kzvk) {
'use strict';

var mod = new kzvk.Module('ui');

mod.default_options = {
    _: true,
    kzvk_button: true,
    ids: false
}

// Включение модуля
kzvk.modules[mod.name] = mod;

//TODO: Ссылка на параметры в сайдбаре (опция в настройках);

})(kzvk);
