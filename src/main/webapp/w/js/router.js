angular.module('xdApp', [
    'xdApp.controllers',
    'ngAnimate',
    'ui.router',
    'ngMaterial', 'ngMessages',
    'ngAria',
    'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.autoResize','ui.grid.edit',
    'multiselect-searchtree', 'ngPopover', 'lfNgMdFileInput'
]).config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    $mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    $mdDateLocaleProvider.days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    $mdDateLocaleProvider.shortDays = ['一', '二', '三', '四', '五', '六', '日'];

    $mdDateLocaleProvider.formatDate = function(date) {
        //manually formate the date style
        if (angular.isDate(date)) {
            return date.Format("yyyy-MM-dd");
        }
        return date;
    };
}]).config(['$mdIconProvider', '$mdThemingProvider', function($mdIconProvider, $mdThemingProvider) {
    /*$mdThemingProvider.theme('default')
        .primaryPalette('light-blue', {
            'default': '300'
        })
        .accentPalette('deep-orange', {
            'default': '500'
        });*/
    var neonRedMap = $mdThemingProvider.extendPalette('indigo', {
        '500': '#4F5199'
    });
    var neonPinkMap = $mdThemingProvider.extendPalette('pink', {
        '500': '#4F5199'
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('neonRed', neonRedMap);
    $mdThemingProvider.definePalette('neonPink', neonPinkMap);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
        .primaryPalette('neonRed', {
            'default': '500'
        }).accentPalette('neonPink', {
            'default': '500'
        });;

    $mdIconProvider
        .defaultIconSet("./img/svg/avatars.svg", 128)
        .icon("menu", "./img/svg/menu.svg", 24)
        .icon("share", "./img/svg/share.svg", 24)
        .icon("google_plus", "./img/svg/google_plus.svg", 24)
        .icon("hangouts", "./img/svg/hangouts.svg", 24)
        .icon("twitter", "./img/svg/twitter.svg", 24)
        .icon("phone", "./img/svg/phone.svg", 24);

}]).config(['$stateProvider', '$urlRouterProvider', '$logProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        var r = {
            'config': ['configuration',
                function(configuration) {
                    return configuration.init();
                }
            ]
        };
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
        }).state('user', {
            url: '/user',
            templateUrl: 'user.html',
            controller: 'UserCtrl'
        }).state('conf', {
            url: '/conf',
            templateUrl: 'conf.html',
            controller: 'ConfCtrl',
	    resolve: r
        });
    }
]);
