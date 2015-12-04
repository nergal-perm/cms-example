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
})

.constant('chartSettings', { 
	seriesOrder: ["Интерес", "Убеждение", "Сделка", "Резерв"],
	funnelSettings: {
		type: 'funnel',
		stacked: 'true',
		legend: {
			align: "left",
			verticalAlign: "bottom",
			draggable: true,            
			visible: true
		}
	},
	barSettings: {
		type: 'bar',
		stacked: 'true',
		stackType: '100%',
		legend: {
			visible: false
		}
	},
	seriesTemplate: {
		tooltip: {
			text: '%t: %v (%npv%)'
		},
	}
});
