(function(){
'use strict';

// Тестирование безопасности
//var eve = document.createElement('script');
//eve.setAttribute('src', chrome.extension.getURL('scripts/eve.js'));
//document.body.appendChild(eve);

// Встраивание векторной графики

var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('images/graphics.svg'), true);
xhr.onreadystatechange = function(){
    if (xhr.readyState !== 4) return false;
    if (xhr.status === 200){
        var self = this;

        var container = document.createElement('div');
        container.style.display = 'none';
        container.innerHTML = self.response;
        document.body.appendChild(container);
    }
}

xhr.send(null);

function init(){
    var modules = [
        'trash',
        'audio',
        'video',
        'debug'
    ];

    kzvk.init(modules);
}

function load_observer(changes){
    each (changes, function(item){
        if ((item.name == 'loaded') && kzvk.loaded){
            Object.unobserve(kzvk, load_observer);
            init();
        }
    });
}

function pre_init(){
    if (kzvk.loaded){
        init();
    } else {
        Object.observe(kzvk, load_observer);
    }
}

function on_load(){
    document.removeEventListener('DOMContentLoaded', on_load);
    window.removeEventListener('load', on_load);
    pre_init();
}

if (document.readyState === 'complete'){
    pre_init();
} else {
    document.addEventListener('DOMContentLoaded', on_load, false);
    window.addEventListener('load', on_load, false);
}

})();
