'use strict';

angular.module('TopMenu')

.controller('MenuCtrl', ['$scope', '$rootScope', '$cookieStore', 
function($scope, $rootScope, $cookieStore) {
	$scope.currentYear = new Date().getFullYear();
	$scope.isCurUserAManager = function() {
		return $rootScope.globals.currentUser.roles.indexOf('manager') !== -1;
	};
	$scope.isCurUserAnAdmin = function() {
		return $rootScope.globals.currentUser.roles.indexOf('admin') !== -1;
	};
	if (!$rootScope.globals) {
		console.log('Retrieving session info from cookie...');
		$rootScope.globals = $cookieStore.get('globals');
	};
	console.log(JSON.stringify($rootScope.globals));
	$scope.curUser = $rootScope.globals.currentUser;
	console.log('Current user: ' + $scope.curUser.displayedName);
}]);
