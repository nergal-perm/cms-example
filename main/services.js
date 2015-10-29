'use strict';

angular.module('DataEntry')

.factory('DataService', function($q, appSettings) {
	var service= {};
	var db = new PouchDB('brinks');
	var remoteCouch = appSettings.db;

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
	}
	
	service.sync = sync;
	service.watchChanges = watchChanges;
	service.dbAddress = remoteCouch;

	service.addRecord = function(record) {
		if (record._rev) {
			db.put(record, record._id, record._rev);
		} else {
			db.put(record);
		}
	};
	
	service.bulkRecords = function(records) {
		db.bulkDocs(records)
		.then(function(result) {
			console.log('Successful bulk update');
		})
		.then(function(err) {
			if(err) {
				console.log('Error while bulk update: ' + err);
			};
		});
	};
	
	service.getAllActiveRecords = function() {
		return $q(function(resolve, reject) {
				db.query(appSettings.activeRecordsQuery, {include_docs: true, descending: true}, 
				function(err, doc) {
					if(err) {
						reject(err);
					} else {
						resolve(doc);
					}
				});
		});
	};

	service.getCurrentStatus = function(qt) {
		var queryType = {
			segment: appSettings.currentSegmentStatus,
			funnel: appSettings.currentFunnelStatus
		};
		
		return $q(function(resolve, reject) {
			db.query(queryType[qt], {group: true}, function(err,doc) {
				if(err) {
					console.log(err);
					reject(err);
				} else {
					console.log(doc);
					resolve(doc);
				}
			});
		});	
	};
	
	service.getFunnelDynamics = function(year) {
		var promises = [];
		var dtb = new Date(year,0,1);
		var dte = new Date(year,11,31);
		
		promises.push($q(function(resolve, reject) {
			db.query(appSettings.funnelStart, {
				endkey: dte.toISOString()
			}, 
			function(err,doc) {
				if(err) {
					console.log(err.message);
					reject(err);
				} else {
					console.log(doc);
					resolve(doc);
				}
			});
		}));
		
		promises.push($q(function(resolve, reject) {
			db.query(appSettings.funnelEnd, {
				startKey: dtb.toISOString(),
				descending: true
			},  
			function(err,doc) {
				if(err) {
					console.log(err.message);
					reject(err);
				} else {
					console.log(doc);
					resolve(doc);
				}
			});
		}));
		
		return $q.all(promises);		
	};

	return service;
})

.factory('Translit', function() {
	var service = {};
	var space = '-';
	
		
	// Массив для транслитерации
	var transl = {
	'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
	'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
	'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
	'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
	' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
	'#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
	'(': space, ')': space,'-': space, '\=': space, '+': space, '[': space,
	']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
	'{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
	'?': space, '<': space, '>': space, '№':space
	}
								


	service.translit = function(rusText) {
		var text = rusText.toLowerCase();
		var result = '';
		var curent_sim = '';	
		
		for(var i=0; i < text.length; i++) {
				// Если символ найден в массиве то меняем его
				if(transl[text[i]] != undefined) {
						if(curent_sim != transl[text[i]] || curent_sim != space){
								result += transl[text[i]];
								curent_sim = transl[text[i]];
						}
				}
				// Если нет, то оставляем так как есть
				else {
						result += text[i];
						curent_sim = text[i];
				}                             
		}         		
		return this.TrimStr(result);			
	};

	service.TrimStr = function (s) {
			s = s.replace(/^-/, '');
			return s.replace(/-$/, '');
	};
		
	return service;		
		
});