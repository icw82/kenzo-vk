(function(kzvk){
'use strict';

kzvk.name_filter = function(name){

    kzvk.options.debug__mode && name && console.log('source:', name);

    if (typeof name === 'string'){
        name = name.replace(/[\\\/:\*\?<>\|\"~]/g, ' ');

        if (kzvk.options.filters__square_brackets === true){
            name = name.replace(/\[.+?\]/g, '');
        }

        if (kzvk.options.filters__curly_brackets === true){
            name = name.replace(/\{.+?\}/g, '');
        }

        name = name.trim();
        name = name.replace(/\s+/g, ' ');
        name = name.replace(/\s(\.\w+?)$/g, '$1');

        if (name.length === 0){
            name = chrome.i18n.getMessage('mistake');
        }

        name = he.decode(name);
    }

    kzvk.options.debug__mode && name && console.log('filtered:', name);

    return name;
}

})(kzvk);
