'use strict';

var cmsApp = angular.module('cmsAngular', [
	'ngRoute',
	'cmsControllers',
	'ui.bootstrap'
]);

cmsApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.html',
				controller: 'CmsCtrl'
			});
		$locationProvider.html5Mode(false).hashPrefix('!');
	}
]);