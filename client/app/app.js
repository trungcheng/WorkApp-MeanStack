/* Monster App */

var workApp = angular.module('workApp', [
    "ui.router",
    "ui.bootstrap",
    "ui.bootstrap.datetimepicker",
    "uiSwitch",
    'angularFileUpload',
    "oc.lazyLoad",
    "ui.select",
    "ngSanitize",
    "pascalprecht.translate",
    "LocalStorageModule",
    "toaster",
    "ngCookies",
    'validation',
    'validation.rule',
    'summernote',
    'mwl.confirm',
]);

// AngularJS v1.3.x workaround for old style controller declarition in HTML
workApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/* Setup App Main Controller */
workApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/* Setup Layout Part - Header */
workApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
workApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
workApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
workApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
workApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Init global settings and run the app */
workApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view    
}]);
// workApp.run(function($rootScope, $state,$interval,config, $location, $http, $cookieStore) {
//     if(config.enableClientAuthExpire){
//         $interval(function(){
//            if($rootScope.rootAuth != null){
//                 if($cookieStore.get('time_out') != null){
//                     $cookieStore.put('time_out',config.timeDelayCheckAuthExpire + $cookieStore.get('time_out'));
//                 }
//                 else{
//                     $cookieStore.put('time_out',config.timeDelayCheckAuthExpire);
//                 }
//            }
//            if($cookieStore.get('time_out') != null && $cookieStore.get('time_out') >= config.timeExpireAuth){
//                 $http.get(API_PATH + 'auth/logout').success(function(response){
//                     if(response.status){
//                         $cookieStore.remove('CurrentUser');
//                         $cookieStore.remove('time_out');
//                         $location.path('access/login');
//                     }
//                 })
//             }
//         },config.timeDelayCheckAuthExpire);
//     }
// });
/* Init global settings and run the app */
workApp.run(function($rootScope, $state,$interval, $location, $http, $cookieStore) {
    $rootScope.$state = $state;
    $rootScope.rootAuth = null;
    $rootScope.rootAuthToken = null;

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        $state.current = toState;
        $rootScope.rootAuth = $cookieStore.get('member');
        $rootScope.rootAuthToken = $cookieStore.get('token');
        if ($rootScope.rootAuth == null || $rootScope.rootAuth == undefined) {
            if($state.current.name != 'access.register' && $state.current.name != 'access.password_reset'){
                $location.path('access/login');
            }else{
                if($state.current.name == 'access.register'){
                    $location.path('access/register');
                }else{
                    $location.path('access/password_reset');
                }
            }
        }
        else{
            $state.current = toState;
            if ($state.current.name == 'access.login') {
                $location.path('app/dashboard');
            }
        }
    });

    $rootScope.logout = function(){
        $cookieStore.remove('member');
        $cookieStore.remove('token');
        $location.path('access/login');
    }
});

workApp.config(function($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location','$cookieStore', function($q, $location,$cookieStore) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token') != null) {
                    config.headers['x-access-token'] = $cookieStore.get('token');
                    // $cookieStore.remove('time_out');
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401) {
                    $cookieStore.remove('token');
                    $cookieStore.remove('member');
                    $location.path('access/login');
                }
                return $q.reject(response);
            }
        };
    }]);
});

// workApp.config(function ($translateProvider, localStorageServiceProvider, $translatePartialLoaderProvider) {
//     $translateProvider.useLoader('$translatePartialLoader', {
//         urlTemplate: 'languages/{part}/{lang}.json'
//     });
//     $translateProvider.preferredLanguage('vn');
//     $translateProvider.useCookieStorage();
//     $translatePartialLoaderProvider.addPart('default');
// });