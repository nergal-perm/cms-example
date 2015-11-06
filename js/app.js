'use strict';

// declare modules
angular.module('DataEntry', ['ui.bootstrap', 'Config']);
angular.module('Authentication', ['Config']);
angular.module('Test', ['Config', 'Authentication']);
angular.module('Config', []);
angular.module('Chart', ['DataEntry']);

angular.module('cmsAngular', [
    'DataEntry',
    'Authentication',
    'Chart',
    'Config',
		'Test',
    'ngRoute',
    'ngCookies',
    'zingchart-angularjs'
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/welcome', {
          controller: 'LoginController',
          templateUrl: 'authentication/views/welcome.html'
        })
        
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'authentication/views/login.html'
        })
        
        .when('/logout', {
          controller: 'LoginController',
          templateUrl: 'authentication/views/logout.html'
        })

        .when('/main', {
            controller: 'CmsCtrl',
            templateUrl: 'main/views/main.html'
        })

				.when('/test', {
					controller: 'TestCtrl',
					templateUrl: 'test/views/test.html'
				})
        
        .when('/charts/status/:chartType', {
          controller: 'StatusCtrl',
          templateUrl: 'chart/views/chart.html'
        })

        .when('/charts/dynamics/:chartType/:year', {
          controller: 'DynamicsCtrl',
          templateUrl: 'chart/views/chart.html'
        })

        .otherwise({ redirectTo: '/welcome' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if (current.indexOf('test') !== -1) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/logout', '/test', '/welcome']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/welcome');
        }
    });
}]);
