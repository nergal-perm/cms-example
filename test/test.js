'use strict';

angular.module('Test')

.controller('TestCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:5984/brinks/_all_docs')
		.success(function(response) {
			console.log('Successfully fetched data');
			console.log(JSON.stringify(response.rows));
			$scope.records = response.rows;
		});

}]);
