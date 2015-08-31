(function(kzvk){
'use strict';

var mod = new kzvk.Module('trash');

mod.observers = []; // TODO: В правильно ли место определения свойства?

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
