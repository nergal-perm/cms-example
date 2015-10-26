'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Test', ['Config']);
angular.module('DataEntry', ['ui.bootstrap', 'Config']);
angular.module('Config', []);

angular.module('cmsAngular', [
    'Authentication',
    'DataEntry',
    'Config',
		'Test',
    'ngRoute',
    'ngCookies'
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'authentication/views/login.html'
        })

        .when('/main', {
            controller: 'CmsCtrl',
            templateUrl: 'main/views/main.html'
        })

				.when('/test', {
					controller: 'TestCtrl',
					templateUrl: 'test/views/test.html'
				})

        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/test']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        console.log("Is restricted: " + restrictedPage + ", is Logged In: " + JSON.stringify(loggedIn));
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });
}]);
