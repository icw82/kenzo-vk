'use strict'

var APP = angular.module('kenzo-vk', ['ngSanitize']);
APP.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

APP.controller('settings', function($scope) {

function replace_links(text, link){
    if (typeof text == 'string')
        return text.replace(/\*(.+?)\*/g, '<a class="a-link" href="' + link + '">$1</a>');
    else
        return text;
}

// Текст
$scope.i18n = {
    header: chrome.i18n.getMessage('o__header'),
    reset: chrome.i18n.getMessage('o__reset'),
    others: chrome.i18n.getMessage('o__others'),
    info: {
        changes: chrome.i18n.getMessage('o__i__changes'),
        beta: replace_links(
            chrome.i18n.getMessage('o__i__beta'),
            'https://vk.com/kenzovk'
        )
    },
    audio: {
        header: chrome.i18n.getMessage('o__audio__header'),
        options: {
            cache: chrome.i18n.getMessage('o__audio__cache'),
            separator: chrome.i18n.getMessage('o__audio__separator'),
            separators: [
                {
                    char: chrome.i18n.getMessage('o__audio__separator__1'),
                    desc: chrome.i18n.getMessage('o__audio__separator__1') + ' (' +
                        chrome.i18n.getMessage('o__audio__separator__1__desc') + ')'
                },{
                    char: chrome.i18n.getMessage('o__audio__separator__2'),
                    desc: chrome.i18n.getMessage('o__audio__separator__2') + ' (' +
                        chrome.i18n.getMessage('o__audio__separator__2__desc') + ')'
                },{
                    char: chrome.i18n.getMessage('o__audio__separator__3'),
                    desc: chrome.i18n.getMessage('o__audio__separator__3') + ' (' +
                        chrome.i18n.getMessage('o__audio__separator__3__desc') + ')'
                }
            ],
            progress_bars: chrome.i18n.getMessage('o__audio__progress_bars'),
            simplified: chrome.i18n.getMessage('o__audio__simplified'),
            simplified__desc: chrome.i18n.getMessage('o__audio__simplified__desc')
        }
    },
    'video': {
        'header': chrome.i18n.getMessage('o__video__header'),
        'options': {
            'progress_bars': chrome.i18n.getMessage('o__video__progress_bars'),
            'simplified': chrome.i18n.getMessage('o__video__simplified')
        }
    },
    'scrobbler': {
        'header': chrome.i18n.getMessage('o__scrobbler__header'),
    },
    'trash': {
        'header': chrome.i18n.getMessage('o__trash__header'),
        'options': {
            'lsb__ad': chrome.i18n.getMessage('o__trash__lsb__ad'),
            'lsb__fr': chrome.i18n.getMessage('o__trash__lsb__fr'),
            'newsads': chrome.i18n.getMessage('o__trash__newsads'),
            'promoted_posts': chrome.i18n.getMessage('o__trash__promoted_posts'),
            'group_recom': chrome.i18n.getMessage('o__trash__group_recom'),
            'profile_rate': chrome.i18n.getMessage('o__trash__profile_rate'),
            'big_like': chrome.i18n.getMessage('o__trash__big_like'),
            'user_reposts': chrome.i18n.getMessage('o__trash__user_reposts'),
            'group_reposts': chrome.i18n.getMessage('o__trash__group_reposts')
        },
    },
    'filters': {
        //'header': chrome.i18n.getMessage('o__trash__header'),
        'options': {
            'brackets': chrome.i18n.getMessage('o__filters__brackets'),
            'square_brackets': chrome.i18n.getMessage('o__filters__square_brackets'),
            'curly_brackets': chrome.i18n.getMessage('o__filters__curly_brackets')
        }
    },
    'debug': {
        'header': chrome.i18n.getMessage('o__debug'),
        'options': {
            'styles': chrome.i18n.getMessage('o__debug__styles'),
            'log': chrome.i18n.getMessage('o__debug__log')
        }
    }
}

$scope.Manifest = chrome.runtime.getManifest();

// Настройки
var watch_flag = false;
$scope.Options = {};
$scope.scrobbler = {
    auth_url: kzvk.modules.scrobbler.auth_url
}
$scope.ctrl = false;

function sync_model(){
    chrome.storage.sync.get(default_options, function(items){
        watch_flag = false;
        $scope.Options = items;
        $scope.$apply();
        watch_flag = true;
    });
}

sync_model();

$scope.$watch('Options', function(){
    (watch_flag) && chrome.storage.sync.set($scope.Options);
}, true);

$scope.defaults = function(){
    chrome.storage.sync.set(default_options);
}

$scope.clear_db = function() {
    chrome.storage.local.clear(function() {
        chrome.storage.local.get(function(){
            //mod.log(arguments);
        });

        alert('Очищено');
    });
}

chrome.storage.onChanged.addListener(function(changes, areaName){
    if (areaName === 'sync'){
        sync_model();
    }
});

// Токен
var token = window.location.href.match(/token=([\w\d]+)/) || false;
if (token)
    kzvk.modules.scrobbler.methods.auth.getSession(token[1]);

// Скрытые опции
document.addEventListener('keydown', function(event) {
    if (!$scope.ctrl && event.keyCode == 17) {
        $scope.ctrl = true;
        $scope.$apply();

        console.log($scope.ctrl)
    }
});
document.addEventListener('keyup', function(event) {
    if ($scope.ctrl && event.keyCode == 17) {
        $scope.ctrl = false;
        $scope.$apply();

        console.log($scope.ctrl)
    }
});

// title
//Настройки Kenzo VK
document.title = chrome.runtime.getManifest().name + ': ' + chrome.i18n.getMessage('o__header');

});
