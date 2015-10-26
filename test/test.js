'use strict';

angular.module('Test')

.controller('TestCtrl', function($scope, $http, appSettings) {

	var viewDoc = {
   _id: "_design/clients",
   language: "javascript",
   views: {
       active: {
           map: "function(doc) {\n  if(!doc.cancelled) {\n    emit(doc._id, doc);\n  }\n}"
       }
   }
	};

	function createCouchDb() {
		$http.put(appSettings.db, '', {
			withCredentials: true
		})
			.success(function(response) {
				$http.put(appSettings.db + '/_design/clients', viewDoc);
			})
			.error(function(err) {
				console.log(err);
			});
	}
	
	function deleteCouchDb() {
		$http.delete(appSettings.db)
			.success(function(response) {
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

});
