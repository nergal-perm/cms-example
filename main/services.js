'use strict';

angular.module('DataEntry')

.factory('DataService', function($q) {
	var service= {};
	var db = new PouchDB('brinks');
	var remoteCouch = 'http://localhost:5984/brinks';

	function watchChanges(callback) {
		db.changes({
			since: 'now',
			live: true
		}).on('change', function(){
			console.log('Changes applied');
			callback();
		});
	}

	function sync() {
		var opts = {live: true};
		db.sync(remoteCouch, opts);
		console.log('Database synced');
	}
	
	service.sync = sync;
	service.watchChanges = watchChanges;

	service.addRecord = function(record) {
		console.log('Start adding...');
		db.put(record, record._id, record._rev, function callback(err, result) {
			if (!err) {
				console.log('Successfully added a record');
			} else {
				console.log(err);
			};
		});
	};
	
	
	service.getAllActiveRecords = function() {
		return $q(function(resolve, reject) {
				db.query('clients/active', {include_docs: true, descending: true}, 
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
