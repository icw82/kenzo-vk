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
    'annotation': chrome.i18n.getMessage('o__annotation'),
    'audio': {
        'header': chrome.i18n.getMessage('o__audio__header'),
        'description': chrome.i18n.getMessage('o__audio__description')
    },
    'trash': {
        'header': chrome.i18n.getMessage('o__trash__header'),
        'description': chrome.i18n.getMessage('o__trash__description'),
        'options': {
            'lsb__ad': chrome.i18n.getMessage('o__trash__lsb__ad'),
            'lsb__fr': chrome.i18n.getMessage('o__trash__lsb__fr'),
            'newsads': chrome.i18n.getMessage('o__trash__newsads')
        }
    },
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
