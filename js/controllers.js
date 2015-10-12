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
		actions: [{ actionType: "Контакт: email", actionDate: "10.10.2015" }]
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
		actions: [{ actionType: "Контакт: email", actionDate: "10.10.2014" }]
	});



	$scope.open = function (index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/myModalContent.html',
			controller: 'ModalCtrl',
			resolve: {
				itemFromView: function () {
					if (index != null) {
						$scope.records[index].index = index;
						return $scope.records[index];
					}
					return null;
				}
			}
		});

		modalInstance.result.then(function (updatedItem) {
			if (updatedItem.index == null) {
				updatedItem.index = $scope.records.length;
				$scope.records.push(updatedItem);
			} else {
				$scope.records[updatedItem.index] = updatedItem;
			}
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

}]);

cmsControllers.controller('ModalCtrl', ['$scope', '$modalInstance', 'itemFromView', function ModalCtrl($scope, $modalInstance, itemFromView) {
	 if (itemFromView) {
		var itemToEdit = itemFromView;
		$scope.item = {};
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
		$scope.item.segmentServices = [];
		$scope.item.segmentServices.push(itemToEdit.segmentServices);
		$scope.item.statusName = itemToEdit.statusName;
		$scope.item.nextActionType = itemToEdit.nextActionType;
		$scope.item.nextActionDate = itemToEdit.nextActionDate;
		$scope.item.actions = [];
		$scope.item.actions.push(itemToEdit.actions);
	 } else {
		$scope.item = {};
		$scope.item.actions = [];
	 }

	 $scope.ok = function () {
		$modalInstance.close($scope.item);
	 };

	 $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	 };
}]);