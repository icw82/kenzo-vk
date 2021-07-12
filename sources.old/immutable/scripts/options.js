'use strict'

// title
//Настройки Kenzo VK
document.title = browser.runtime.getManifest().name + ': ' + browser.i18n.getMessage('o__header');


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('OptionsHeaderCtrl', OptionsHeaderCtrl);

OptionsHeaderCtrl.$inject = ['$scope', '$element', 'data'];
function OptionsHeaderCtrl($scope, $element, data) {
    var self = this;

    $scope.manifest = data.manifest;

}

// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('OptionsTopCtrl', OptionsTopCtrl);

OptionsTopCtrl.$inject = ['$scope', '$element', 'data'];
function OptionsTopCtrl($scope, $element, data) {
    var self = this;

    this.manifest = data.manifest;
    this.defaults = data.defaults;

}
