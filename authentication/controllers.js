'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'appSettings', '$http',
    function ($scope, $rootScope, $location, AuthenticationService, appSettings, $http) {
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
        
        $scope.createAdmin = function() {
          $http.put(appSettings.db, '', {
            withCredentials: true
          });
          $http.get('test/users.json').success(function(response) {
            response.docs.forEach(function(element, index) {
              $http.post(appSettings.usersDb, element);  
            });
          });
        };
       
    }]);