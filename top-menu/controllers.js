'use strict';

angular.module('TopMenu')

.controller('MenuCtrl', ['$scope', '$rootScope', '$location', 
function($scope, $rootScope, $location) {
	$scope.currentYear = new Date().getFullYear();
	$scope.reportLocation = $location.path().indexOf('charts') !== -1;
}]);