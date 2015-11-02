'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'appSettings',
    function ($scope, $rootScope, $location, AuthenticationService, appSettings) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $scope.$apply($location.path('/main'));
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                    $scope.$apply();
                }
            });
        };
    }]);