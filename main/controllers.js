'use strict';

angular.module('DataEntry')

.controller('CmsCtrl', 
	['$scope', '$uibModal', 'DataService', 'Translit', '$rootScope',
	function CmsCtrl($scope, $uibModal, DataService, Translit, $rootScope) {
		var lookup={};
		var records = [];
		

		function init() {
			$scope.records = [];	
			DataService.watchChanges(updateView);
			DataService.sync();
			updateView();
		};
		
		init();

		function updateView() {
			records.length = 0;
			$scope.records.length = 0;	
			var specificQuery;
			if ($rootScope.globals.currentUser.roles.indexOf("manager") !== -1) {
				specificQuery = DataService.getAllActiveRecords;
			} else {
				specificQuery = DataService.getActiveRecordsForUser;
			}
			specificQuery($rootScope.globals.currentUser.username).then(function(response) {
				response.rows.forEach(function(element) {
					records.push(element.doc);
					lookup[element.doc._id] = element.doc;
				}, this);
				$scope.records = records;
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
			var recordsToWrite = [];
			if (!updatedItem._id) {
				// New item
				updatedItem._id = 'client:' + Translit.translit(updatedItem.clientName) + ':1';
			} else {
				// Updated item - should check for changed properties
				var originalItem = lookup[updatedItem._id];
				if (originalItem.segmentName !== updatedItem.segmentName || 
					originalItem.segmentRevenue !== updatedItem.segmentRevenue ||
					originalItem.segmentProfit !== updatedItem.segmentProfit ||
					originalItem.statusName !== updatedItem.statusName) {
						// Need to create another document
						originalItem.cancelled = new Date().toISOString();
						var originalId = originalItem._id.split(':');
						var newId = originalId.slice(0,2);
						newId.push(++originalId[2]);
						updatedItem._id = newId.join(':');
						recordsToWrite.push(originalItem);
				};
			}
			updatedItem.created = new Date().toISOString();
			updatedItem.cancelled = "2099-12-31T23:59:59.999Z";
			recordsToWrite.push(updatedItem);
			DataService.bulkRecords(recordsToWrite);
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

}])

.controller('ModalCtrl', 
	['$scope', '$modalInstance', 'itemFromView', '$rootScope', 
	function ModalCtrl($scope, $modalInstance, itemFromView, $rootScope) {
	 
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
		$scope.item.user = itemToEdit.user;
	 } else {
		$scope.item = {};
		$scope.item.actions = [];
		$scope.item.segmentServices = [];
		$scope.item.user = {
			name: $rootScope.globals.currentUser.username,
			displayedName: $rootScope.globals.currentUser.displayedName
		}
	 }

	 $scope.atmServices = ["atm-AMS", "atm-Инкассация"];
	 $scope.citServices = ['cit-Ритейл', 'cit-Банковские офисы','cit-ЦБ'];
	 $scope.logServices = ['log-Городские', 'log-Региональные'];
	 $scope.keepServices = ['keep-Краткосрочное','keep-Долгосрочное'];
	 $scope.mpServices = ['mp-Ритейл','mp-Банковские офисы','mp-ATM','mp-Терминалы','mp-АДМ'];
	 $scope.amsServices=['ams-Финансовый менеджмент','ams-"Таинственные исчезновения"','ams-Технический мониторинг','ams-Экспресс FLM','ams-SLM','ams-iSLM','ams-Менеджмент поставщиков услуг','ams-Страхование','ams-Аренда'];
	 $scope.toggleCheck = function(service) {
		 if ($scope.item.segmentServices.indexOf(service) === -1) {
			 $scope.item.segmentServices.push(service);
		 } else {
			 $scope.item.segmentServices.splice($scope.item.segmentServices.indexOf(service), 1);
		 };
	 };

		$scope.markActionAsDone = function() {
			$scope.item.actions.push($scope.item.nextAction);
			$scope.item.nextAction = {};
		};

	 $scope.ok = function () {
		$modalInstance.close($scope.item);
	 };

	 $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	 };
}]);
