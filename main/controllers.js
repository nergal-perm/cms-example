'use strict';

angular.module('DataEntry')

.controller('CmsCtrl', 
	['$scope', '$uibModal', 'DataService', 
	function CmsCtrl($scope, $uibModal, DataService) {
		var lookup={};

		function init() {
			
			DataService.sync();
			DataService.watchChanges(updateView);

			updateView();
			initLookup();
			console.log(JSON.stringify(lookup));
		};
		
		init();

		function initLookup() {
			for (var i=0, len=$scope.records.length; i<len; i++) {
				lookup[$scope.records[i]._id] = $scope.records[i];
			};
		};

		function updateView() {
			if(!$scope.records) {
			 $scope.records	= [];
			}
			$scope.records.length = 0;
			DataService.getAllActiveRecords().then(function(response) {
				response.rows.forEach(function(element) {
					$scope.records.push(element.doc);
				}, this);
			});
		};

	$scope.open = function (index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'main/views/myModalContent.html',
			controller: 'ModalCtrl',
			resolve: {
				itemFromView: function () {
					if (index != null) {
						return $scope.records[index];
					}
					return null;
				}
			}
		});

		modalInstance.result.then(function (updatedItem) {
			if (!updatedItem._id) {
				// New item
				updatedItem._id = new Date().toISOString();
			} else {
				// Updated item - should check for changed properties
				var originalItem = lookup[updatedItem._id];
				if (originalItem.segmentName !== updatedItem.segmentName || 
					originalItem.segmentRevenue !== updatedItem.segmentRevenue ||
					originalItem.segmentProfit !== updatedItem.segmentProfit ||
					originalItem.statusName !== updatedItem.statusName) {
						// Need to create another document
						originalItem.cancelled = new Date().toISOString();
						DataService.addRecord(originalItem);
						updatedItem._id = new Date().toISOString();
				};
			}
			//$scope.records[updatedItem.index] = updatedItem;
			console.log('ID: ' + updatedItem._id + ', rev: ' + updatedItem._rev);
			DataService.addRecord(updatedItem);
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

}])

.controller('ModalCtrl', 
	['$scope', '$modalInstance', 'itemFromView', 
	function ModalCtrl($scope, $modalInstance, itemFromView) {
	 
	 if (itemFromView) {
		var itemToEdit = itemFromView;
		$scope.item = {};
		$scope.item._id = itemToEdit._id;
		$scope.item._rev = itemToEdit._rev;
		$scope.item.index = itemToEdit.index;
		$scope.item.clientName = itemToEdit.clientName;
		$scope.item.contactFullName = itemToEdit.contactFullName;
		$scope.item.contactJobTitle = itemToEdit.contactJobTitle;
		$scope.item.contactPhone = itemToEdit.contactPhone;
		$scope.item.contactMobile = itemToEdit.contactMobile;
		$scope.item.contactEmail = itemToEdit.contactEmail;
		$scope.item.contactBirthDate = itemToEdit.contactBirthDate;
		$scope.item.bossFullName = itemToEdit.bossFullName;
		$scope.item.bossJobTitle = itemToEdit.bossJobTitle;
		$scope.item.bossPhone = itemToEdit.bossPhone;
		$scope.item.bossMobile = itemToEdit.bossMobile;
		$scope.item.bossEmail = itemToEdit.bossEmail;
		$scope.item.bossBirthDate = itemToEdit.bossBirthDate;
		$scope.item.segmentName = itemToEdit.segmentName;
		$scope.item.segmentRevenue = itemToEdit.segmentRevenue;
		$scope.item.segmentProfit = itemToEdit.segmentProfit;
		$scope.item.segmentServices = itemToEdit.segmentServices;
		$scope.item.statusName = itemToEdit.statusName;
		$scope.item.nextAction = itemToEdit.nextAction;
		$scope.item.actions = itemToEdit.actions;
	 } else {
		$scope.item = {};
		$scope.item.actions = [];
		$scope.item.segmentServices = [];
	 }

	 $scope.atmServices = ["atm-AMS", "atm-Инкассация"];
	 $scope.citServices = ['cit-Ритейл', 'cit-Банковские офисы','cit-ЦБ'];
	 $scope.logServices = ['log-Городские', 'log-Региональные'];
	 $scope.keepServices = ['keep-Краткосрочное','keep-Долгосрочное'];
	 $scope.mpServices = ['mp-Ритейл','mp-Банковские офисы','mp-ATM','mp-Терминалы','mp-АДМ'];
	 $scope.amsServices=['ams-Финансовый менеджмент','ams-"Таинственные исчезновения"','ams-Технический мониторинг','ams-Экспресс FLM','ams-SLM','ams-iSLM','ams-Менеджмент поставщиков услуг','ams-Страхование','ams-Аренда'];
	 $scope.toggleCheck = function(service) {
		 console.log('Checkng service: ' + service);
		 console.log('Its index: ' + $scope.item.segmentServices.indexOf(service));
		 if ($scope.item.segmentServices.indexOf(service) === -1) {
			 $scope.item.segmentServices.push(service);
		 } else {
			 $scope.item.segmentServices.splice($scope.item.segmentServices.indexOf(service), 1);
		 };
	 };

	 $scope.ok = function () {
		$modalInstance.close($scope.item);
	 };

	 $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	 };
}]);
