'use strict';

angular.module('TopMenu')

.controller('MenuCtrl', ['$scope', '$rootScope', 
function($scope, $rootScope) {
	$scope.currentYear = new Date().getFullYear();
}]);