(function(kzvk){
'use strict';

var mod = new kzvk.Module('trash');

mod.observers = []; // FUTURE: В правильно ли место определения свойства?

// Включение модуля
kzvk.modules[mod.name] = mod;

//FUTURE: Удалать шары групп и прочего;
//FUTURE: Удалять шары групп, в которых я и так состою;
//TODO: Индикация удалённых репостов (количество);
//NOTE: Нужно ли делать искустенную прокурутку для удаления всех репостов ленты?;

})(kzvk);