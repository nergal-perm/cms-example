	'use strict';

	var app = angular.module('cmsAngular', ['ngRoute', 'cmsControllers', 'ui.bootstrap', 'ngCookies']);

	app
		.config(config)
		.run(run);

	config.$inject = ['$routeProvider', '$locationProvider'];
	function config($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.html',
				controller: 'CmsCtrl',
				controllerAs: 'vm'
			}).
			when('/login', {
				templateUrl: 'login/login.view.html',
				controller: 'LoginCtrl',
				controllerAs: 'vm'
			}).
			when('/logout', {
				templateUrl: 'logout/logout.view.html',
				controller: 'LogoutCtrl',
				controllerAs: 'vm'
			}).
			otherwise({redirectTo: '/login' });
		$locationProvider.html5Mode(false).hashPrefix('!');
	};

	run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
	function run($rootScope, $location, $cookieStore, $http) {
		// оставляем пользователя авторизованным при перезагрузке страницы
		$rootScope.globals = $cookieStore.get('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authData;
		}

		$rootScope.$on('$locationChangeStart', function(event, next, curent) {
			// перенаправление на страницу логина для незарегистрированных пользователей
			var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('login');
			}
		});
	};
