//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|
'use strict'

var APP = angular.module('kenzo-vk', []);
APP.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

APP.controller('settings', function($scope){

// Текст
$scope.i18n = {
    'header': chrome.i18n.getMessage('o__header'),
    'debug': chrome.i18n.getMessage('o__debug'),
    'annotation': chrome.i18n.getMessage('o__annotation'),
    'audio': {
        'header': chrome.i18n.getMessage('o__audio__header'),
        'description': chrome.i18n.getMessage('o__audio__description'),
        'options': {
            'cache': chrome.i18n.getMessage('o__audio__cache'),
            'vbr': chrome.i18n.getMessage('o__audio__vbr'),
            'separator': chrome.i18n.getMessage('o__audio__separator'),
            'progress_bars': chrome.i18n.getMessage('o__audio__progress_bars'),
            'simplified': chrome.i18n.getMessage('o__audio__simplified')
        }
    },
    'video': {
        'header': chrome.i18n.getMessage('o__video__header'),
        'description': chrome.i18n.getMessage('o__video__description'),
        'options': {
            'progress_bars': chrome.i18n.getMessage('o__video__progress_bars'),
            'simplified': chrome.i18n.getMessage('o__video__simplified')
        }
    },
    'trash': {
        'header': chrome.i18n.getMessage('o__trash__header'),
        'description': chrome.i18n.getMessage('o__trash__description'),
        'options': {
            'lsb__ad': chrome.i18n.getMessage('o__trash__lsb__ad'),
            'lsb__fr': chrome.i18n.getMessage('o__trash__lsb__fr'),
            'newsads': chrome.i18n.getMessage('o__trash__newsads'),
            'group_recom': chrome.i18n.getMessage('o__trash__group_recom')
        }
    }
}

$scope.Manifest = chrome.runtime.getManifest();

// Настройки
var watch_flag = false;
$scope.Options = {};

chrome.storage.sync.get(default_options, function(items){
    watch_flag = false;
    $scope.Options = items;
    $scope.$apply();
    watch_flag = true;
});

$scope.$watch('Options', function(){
    (watch_flag) && chrome.storage.sync.set($scope.Options);
}, true);

/*
chrome.storage.onChanged.addListener(function(changes, areaName){
    console.log(changes);
    console.log(areaName);
})
*/

});
