'use strict';

angular.module('Config')

.constant('appSettings', {
	db: 'http://localhost:5984/brinks',
	activeRecordsQuery: 'clients/active',
	currentSegmentStatus: 'clients/segmentStatus',
	currentFunnelStatus: 'funnel/currentStatus',
	funnelStart: 'funnel/byCreatedDate',
	funnelEnd: 'funnel/byCancelledDate'	
});
