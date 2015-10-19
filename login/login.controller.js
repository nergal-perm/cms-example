'use strict';

angular.module('cmsAngular').controller('LoginCtrl', LoginCtrl);

LoginCrl.$inject(['$location', 'AuthenticationService']);
function LoginCtrl($location, AuthenticationService) {
	var vm = this;

	vm.login = login;
	vm.loginError = false;

	(function initController() {
		AuthenticationService.ClearCredentials();
	})();

	function login() {
		vm.dataLoading = true;
		console.log('Entered login function');
		AuthenticationService.Login(vm.username, vm.password, function(response) {
			if(response.success) {
				AuthenticationService.SetCredentials(vm.username, vm.password);
				$location.path('/');
			} else {
				//FlashService.Error(response.message);
				vm.loginError = true;
				vm.dataLoading = false;
			}
		});
	};
};
