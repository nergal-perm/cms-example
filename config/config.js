'use strict';

angular.module('Config')

.constant('appSettings', {
	db: 'http://localhost:5984/brinks',
	usersDb: 'http://localhost:5984/_users',
	activeRecordsQuery: 'clients/active',
	activeByUserQuery: 'clients/byUser',
	funnelStart: 'charts/funnelCreatedDate',
	funnelEnd: 'charts/funnelCancelledDate',
	segmentStart: 'charts/segmentCreatedDate',
	segmentEnd: 'charts/segmentCancelledDate'	
})

.constant('chartSettings', { 
	funnelSeriesOrder: ["Интерес", "Убеждение", "Сделка", "Резерв"],
	segmentSeriesOrder: ["Прибыльный НЕЦЕЛЕВОЙ", "Прибыльный ЦЕЛЕВОЙ"],
	funnelSettings: {
		type: 'funnel',
		stacked: 'true',
		legend: {
			align: "left",
			verticalAlign: "bottom",
			draggable: true,            
			visible: true,
			shared: true
		},
	  width: '35%',
	  x: '2%'
	},
	barSettings: {
		type: 'bar',
		stacked: 'true',
		stackType: '100%',
		legend: {
			visible: false,
			shared: true
		},
		width: '58%',
		x: '40%'
	},
	seriesTemplate: {
		tooltip: {
			text: '%t: %v (%npv%)'
		}
	},
	plotColors: {
		"Интерес": ["yellow", "yellow"],
		"Убеждение": ["green","green"],
		"Сделка": ["blue","blue"],
		"Резерв": ["grey","grey"],
		"Прибыльный ЦЕЛЕВОЙ": ["blue","blue"],
		"Прибыльный НЕЦЕЛЕВОЙ": ["red", "red"]
	}
});
