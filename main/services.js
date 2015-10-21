'use strict';

angular.module('DataEntry')

.factory('DataService', function($q) {
	var service= {};
	var db = new PouchDB('brinks');
	var remoteCouch = false;
	
	service.addRecord = function(record) {
		console.log('Start adding...');
		db.put(record, function callback(err, result) {
			if (!err) {
				console.log('Successfully added a record');
				console.log(JSON.stringify(result));
			};
		});
	};
	
	
	service.getAllActiveRecords = function() {
		console.log(JSON.stringify(db));
		return $q(function(resolve, reject) {
				db.allDocs({include_docs: true, descending: true}, 
				function(err, doc) {
					if(err) {
						console.log('Error in DataService');
						reject(err);
					} else {
						console.log('Success in DataService');
						console.log(JSON.stringify)
						resolve(doc);
					}
				});
		});
	};
	
	return service;
});