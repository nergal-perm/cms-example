'use strict';

angular.module('Test')

.controller('TestCtrl', [
	'$scope', '$http', 'appSettings', 'AuthenticationService', '$rootScope', '$location',	
	function($scope, $http, appSettings, Auth, $rootScope, $location) {

	function init() {
		$http.defaults.headers.common.Authorization = 'Basic ';		
	};

	function createCouchDb() {
		$http.put(appSettings.db, '', {
			withCredentials: false
		})
			.success(function(response) {
				$http.get('test/designClients.json').success(function(response) {
					$http.put(appSettings.db + '/_design/clients', response);	
				});
				$http.get('test/designCharts.json').success(function(response) {
					$http.put(appSettings.db + '/_design/charts', response);	
				});				
				$http.get('test/db-seed.json').success(function(response) {
					$http.post(appSettings.db + '/_bulk_docs', response);
				});
				$http.get('test/users.json').success(function(response) {
					$http.post(appSettings.db.replace('brinks', '_users') + '/_bulk_docs', response);
				});
				$http.get('test/security.json').success(function(response) {
					$http.put(appSettings.db + '/_security', response);
				});				
			})
			.error(function(err) {
				console.log(err);
			});
	}
	
	function deleteCouchDb() {
		$http.delete(appSettings.db)
			.success(function(response) {
				clearPouchDb();
				console.log(response);
			})
			.error(function(err) {
				console.log(err);
			});
	}	
	
	function clearPouchDb() {
		var db = new PouchDB('brinks');
		db.destroy().then(function(response) {
			console.log(response);
		});
	}
	
	$scope.createCouchDb = createCouchDb;
	$scope.clearPouchDb = clearPouchDb;
	$scope.deleteCouchDb = deleteCouchDb;

	init();
}]);
