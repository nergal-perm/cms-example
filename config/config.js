'use strict';

angular.module('Config')

.constant('appSettings', {
	db: 'http://localhost:5984/test',
	activeRecordsQuery: 'clients/active'
});
