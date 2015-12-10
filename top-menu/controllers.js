'use strict';

angular.module('TopMenu')

.controller('MenuCtrl', ['$scope', '$rootScope', '$location', 
function($scope, $rootScope, $location) {
	$scope.currentYear = new Date().getFullYear();
	$scope.isCurUserAManager = function() {
		return $rootScope.globals.currentUser.roles.indexOf('manager') !== -1;
	};
	$scope.isCurUserAnAdmin = function() {
		return $rootScope.globals.currentUser.roles.indexOf('admin') !== -1;
	};
	$scope.curUser = $rootScope.globals.currentUser;
	console.log('Current user: ' + $scope.curUser.displayedName);
}]);
