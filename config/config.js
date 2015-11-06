'use strict';

angular.module('Config')

.constant('appSettings', {
	db: 'http://localhost:5984/brinks',
	usersDb: 'http://localhost:5984/_users',
	activeRecordsQuery: 'clients/active',
	activeByUserQuery: 'clients/byUser',
	currentSegmentStatus: 'clients/segmentStatus',
	currentFunnelStatus: 'funnel/currentStatus',
	currentUserFunnelStatus: 'funnel/currentStatusByUser',
	funnelStart: 'funnel/byCreatedDate',
	funnelEnd: 'funnel/byCancelledDate'	
});
