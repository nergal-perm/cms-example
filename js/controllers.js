'use strict';

var cmsControllers = angular.module('cmsControllers', []);
cmsControllers.controller('CmsCtrl', ['$scope', '$uibModal', function CmsCtrl($scope, $uibModal) {
	$scope.records = [];
	
	$scope.records.push({
		clientName: "Сбербанк",
		contactFullName: "Иванов Иван Иванович",
		contactJobTitle: "менеджер отдела развития бизнеса",
		contactPhone: "+1234567890",
		contactMobile: "+1234567890",
		contactEmail: "ivanov@sberbank.example",
		contactBirthDate: "23.05.1984",
		bossFullName: "Петров Петр Петрович",
		bossJobTitle: "руководитель отделения",
		bossPhone: "+9876543210",
		bossMobile: "+9876543210",
		bossEmail: "petrov@sberbank.example",
		bossBirthDate: "31.03.1984",
		segmentName: "Прибыльный ЦЕЛЕВОЙ",
		segmentRevenue: 400000,
		segmentProfit: 0.05,
		segmentServices: ["АТМ", "Перевозки региональные"],
		statusName: "Убеждение",
		nextActionType: "Контакт: звонок",
		nextActionDate: "13.10.2015",
		actions: [ { actionType: "Контакт: email", actionDate: "10.10.2015"}] 
	});
	
	$scope.records.push({
		clientName: "ВТБ 24",
		contactFullName: "Андреев Андрей Андреевич",
		contactJobTitle: "простой клерк",
		contactPhone: "+1234567890",
		contactMobile: "+1234567890",
		contactEmail: "andreev@vtb24.example",
		contactBirthDate: "23.05.1984",
		bossFullName: "Сидоров Сидор Сидорович",
		bossJobTitle: "непростой руководитель",
		bossPhone: "+9876543210",
		bossMobile: "+9876543210",
		bossEmail: "petrov@vtb24.example",
		bossBirthDate: "31.03.1984",
		segmentName: "Прибыльный НЕЦЕЛЕВОЙ",
		segmentRevenue: 150000,
		segmentProfit: 0.10,
		segmentServices: ["Перевозки региональные", "Страхование"],
		statusName: "Резерв",
		nextActionType: "Контакт: звонок",
		nextActionDate: "25.10.2015",
		actions: [ { actionType: "Контакт: email", actionDate: "10.10.2014"}] 
	});

		

	$scope.open = function (index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/myModalContent.html',
			controller: 'ModalCtrl',
			resolve: {
				itemFromView: function () {
					console.log('Index: ' + index);
					if (index != null) {
						return $scope.records[index];
					}
					return null;
				}
			}
		});
		
		modalInstance.result.then(function (updatedItem) {
			$scope.records.push(updatedItem);
			//$scope.$apply;
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

}]);

cmsControllers.controller('ModalCtrl', ['$scope', '$modalInstance', 'itemFromView', function ModalCtrl($scope, $modalInstance, itemFromView) {
	console.log(JSON.stringify(itemFromView));
	 var newItem = {
		clientName: "Петрокоммерц",
		contactFullName: "Андреев Андрей Андреевич",
		contactJobTitle: "простой клерк",
		contactPhone: "+1234567890",
		contactMobile: "+1234567890",
		contactEmail: "andreev@vtb24.example",
		contactBirthDate: "23.05.1984",
		bossFullName: "Сидоров Сидор Сидорович",
		bossJobTitle: "непростой руководитель",
		bossPhone: "+9876543210",
		bossMobile: "+9876543210",
		bossEmail: "petrov@vtb24.example",
		bossBirthDate: "31.03.1984",
		segmentName: "Прибыльный ЦЕЛЕВОЙ",
		segmentRevenue: 1000000,
		segmentProfit: 0.12,
		segmentServices: ["Перевозки региональные", "Страхование"],
		statusName: "Сделка",
		nextActionType: "Контакт: звонок",
		nextActionDate: "25.10.2015",
		actions: [ { actionType: "Контакт: email", actionDate: "10.10.2014"}]		 
	 };
	 
	 if (itemFromView) {
		 $scope.item = itemFromView;
	 } else {
		 $scope.item = newItem;
	 }
	 
	 $scope.ok = function() {
		 $modalInstance.close(newItem);
	 };
	 
	 $scope.cancel = function() {
		 $modalInstance.dismiss('cancel');
	 }; 	
}]);