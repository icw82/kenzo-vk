(function(kzvk){
'use strict';

var mod = {
    name: 'noname',
    version: '1.0.0'
};

mod.init = function(){

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);


(function(kzvk){
'use strict';

var mod = kzvk.modules.audio;

mod.foo = function(){

}

})(kzvk);
