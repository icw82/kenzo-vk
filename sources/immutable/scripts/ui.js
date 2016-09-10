'use strict';

// Встраивание векторной графики
core.utils.inject_to_dom('svg', chrome.extension.getURL('images/graphics.svg'));

const modules = [];

angular
    .module('kenzo', modules)
    .config(symbols)

symbols.$inject = ['$interpolateProvider'];
function symbols($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}

// ————————————————————————————————————————
angular
    .module('kenzo')
    .filter('safe', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

// ————————————————————————————————————————
angular
    .module('kenzo')
    .filter('capitalize', function() {
        return function(input) {
            if (typeof input === 'string' && input.length > 0)
                return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase()
            else
                return input
        };
    });

// ————————————————————————————————————————
angular
    .module('kenzo')
    .directive('block', function () {
        return {
            replace: true, // Весьма уёбищно сие
            restrict: 'A',
            templateUrl: function (element, attr) {
                return 'blocks/' + attr.block + '.html';
            }
        };
    });

// ————————————————————————————————————————
angular
    .module('kenzo')
    .service('data', data);

data.$inject = ['$rootScope'];
function data($rootScope) {
    const self = this;

    // Текст
    const pre_i18n = get_messages(
        [
            'audio', [
                'header',
                'cache',
                'download_button',
                'replace_play_button',
                'separator',
                'separator__desc'
            ]
        ], [
            'debug', [
                'header',
                'styles',
                'log'
            ]
        ], [
            'download_button', [
                'simplified',
                'simplified__desc'
            ]
        ], [
            'filters', [
                'brackets',
                'square_brackets',
                'curly_brackets'
            ]
        ], [
            'info', [
                'changes',
                'in2006',
                'in2016',
                'beta'
            ]
        ], [
            'header'
        ], [
            'common'
        ], [
            'reset'
        ], [
            'scrobbler', [
                'header',
                'm4m',
                'm4m__desc',
                'name_filter'
            ]
        ], [
            'trash', [
                'header',
                'sidebar_ads',
                'potential_friends',
                'newsads',
                'promoted_posts',
                'group_recom',
                'profile_rate',
                'big_like',
                'user_reposts',
                'group_reposts'
            ]
        ], [
            'ui', [
                'header',
                'ids',
                'unrounding',
                'sidebar_button'
            ]
        ], [
            'video', [
                'header',
                'format_before_ext',
                'format_before_ext__desc'
            ]
        ]
    );

    function get_messages() {
        var pagination = {};
        var args = [];
        var i18n = {};

        for (var i = 0; i < arguments.length; i++ ) {
            args.push(arguments[i])
        }

        each (args, function (item) {
            var root = item[0];
            var branch = item[1];

            if (typeof root !== 'string')
                throw new Error('get_messages error 1');

            if (root in i18n)
                console.warn('переопределение');
            i18n[root] = {};

            if (branch instanceof Array) {
                each (branch, function(item) {
                    if (typeof item !== 'string')
                        throw new Error('get_messages error 2');

                    i18n[root][item] = chrome.i18n.getMessage('o__' + root + '__' + item);
                });
            } else if (item.length === 1) {
                i18n[root] = chrome.i18n.getMessage('o__' + root);
            } else
                throw new Error('get_messages error 3');
        });

        return i18n;
    }

    function replace_links(text, link) {
        if (typeof text == 'string')
            return text.replace(/\*(.+?)\*/g, '<a class="a-link" href="' + link + '">$1</a>');
        else
            return text;
    }

    pre_i18n.info.beta = replace_links(pre_i18n.info.beta, 'https://vk.com/kenzovk');

    // FIX: Убрать этот бред отсюда
    function get_msg(name) { return chrome.i18n.getMessage('o__' + name) }
    pre_i18n.audio.separators = [
        {
            char: get_msg('audio__separator__1'),
            desc: get_msg('audio__separator__1') + ' (' +
                get_msg('audio__separator__1__desc') + ')'
        },{
            char: get_msg('audio__separator__2'),
            desc: get_msg('audio__separator__2') + ' (' +
                get_msg('audio__separator__2__desc') + ')'
        },{
            char: get_msg('audio__separator__3'),
            desc: get_msg('audio__separator__3') + ' (' +
                get_msg('audio__separator__3__desc') + ')'
        }
    ];

    $rootScope.i18n = pre_i18n;
    console.log('i18n', pre_i18n);

    $rootScope.options = {};
    var listen_storage = false;

//    chrome.storage.onChanged.addListener(function(changes, areaName) {
//        if (areaName === 'sync') {
//            sync_model();
//        }
//    });
//
//    sync_model();
//
//    function sync_model() {
//        listen_storage = false;
//
//        chrome.storage.sync.get(ext.default_options, function(items) {
//            $rootScope.options = items;
//            $rootScope.$apply();
//            listen_storage = true;
//        });
//    }

    $rootScope.$watch('options', function() {
        (listen_storage) && chrome.storage.sync.set($rootScope.options);
    }, true);


    this.manifest = chrome.runtime.getManifest();

    this.clear_db = function() {
        chrome.storage.local.clear(function() {
            chrome.storage.local.get(function() {
                //mod.log(arguments);
            });

            alert('Очищено');
        });
    }

    this.defaults = function() {
        if (confirm('Вы действительно хотите сбросить настройки?')) {
//            chrome.storage.sync.set(ext.defaults);
        }
    }

    $rootScope.ctrl_is_pressed = false;

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 17) {
            $rootScope.ctrl_is_pressed = true;
            $rootScope.$apply();

//            console.log($rootScope.ctrl_is_pressed);
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.keyCode === 17) {
            $rootScope.ctrl_is_pressed = false;
            $rootScope.$apply();

//            console.log($rootScope.ctrl_is_pressed);
        }
    });

    this.download_queue = [];
    get_download_queue()

    function get_download_queue() {
        chrome.storage.local.get('downloads', function(data) {
            self.download_queue = data.downloads;
            $rootScope.$apply();
        });

    }

    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if ((areaName == 'local') && ('downloads' in changes)) {
            get_download_queue();
        }
    });

};


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('AudioModCtrl', AudioModCtrl);

AudioModCtrl.$inject = ['$scope', '$element', 'data'];
function AudioModCtrl($scope, $element, data) {
    var self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('VideoModCtrl', VideoModCtrl);

VideoModCtrl.$inject = ['$scope', '$element', 'data'];
function VideoModCtrl($scope, $element, data) {
    const self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('ScrobblerModCtrl', ScrobblerModCtrl);

ScrobblerModCtrl.$inject = ['$scope', '$element', 'data'];
function ScrobblerModCtrl($scope, $element, data) {
    const self = this;

    this.scrobbler = {
        auth_url: ext.modules.scrobbler.auth_url
    }

    // Токен
    var token = window.location.href.match(/token=([\w\d]+)/) || false;
    if (token)
        ext.modules.scrobbler.methods.auth.getSession(token[1]);

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('CommonOptionsCtrl', CommonOptionsCtrl);

CommonOptionsCtrl.$inject = ['$scope', '$element', 'data'];
function CommonOptionsCtrl($scope, $element, data) {
    const self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('UIModCtrl', UIModCtrl);

UIModCtrl.$inject = ['$scope', '$element', 'data'];
function UIModCtrl($scope, $element, data) {
    const self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('TrashModCtrl', TrashModCtrl);

TrashModCtrl.$inject = ['$scope', '$element', 'data'];
function TrashModCtrl($scope, $element, data) {
    const self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('DebugModCtrl', DebugModCtrl);

DebugModCtrl.$inject = ['$scope', '$element', 'data'];
function DebugModCtrl($scope, $element, data) {
    const self = this;

}


// ————————————————————————————————————————
angular
    .module('kenzo')
    .controller('QueueCtrl', QueueCtrl);

QueueCtrl.$inject = ['$scope', '$element', 'data'];
function QueueCtrl($scope, $element, data) {
    const self = this;

    this.list = data.download_queue;
    this.extedned_view = [];

    $scope.$watch(function() {
        return data.download_queue;

    }, function() {
        self.list = data.download_queue;

    }, true);

    this.state_class = function(id) {
        if (id === 0)
            return 'reserve';
        if (id === 1)
            return 'pending';
        if (id === 2)
            return 'active';
        if (id === 3)
            return 'paused';

        return '';
    }

    this.toggle_view = function(id) {
        let index = this.extedned_view.indexOf(id);

        if (index >= 0)
            this.extedned_view.splice(index, 1);
        else
            this.extedned_view.push(id);
    }

    this.remove = function(id) {
        chrome.runtime.getBackgroundPage(function(background) {
            let queue = background.ext.modules.downloads.queue;
            console.log('REMOVE ID', id);
            queue.remove(id);
        });
    }
}

