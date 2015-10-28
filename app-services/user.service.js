'use strict';

angular.module('CmsAngular').factory('UserService', UserService);

UserService.$inject = ['$timeout', '$filter', '$q'];
function UserService($timeout, $filter, $q) {
	var service = {};

	service.GetByUsername = GetByUserName;
	service.Create = Create;

	return service;

	function GetByUserName(username) {
		var deferred = $q.defer();
		var filtered = $filter('filter')(getUsers(), { username: username });
		var user = filtered.length ? filtered[0] : null;
		deferred.resolve(user);
		return deferred.promise;
	};	

	function Create(user) {
		var deferred = $q.defer();

		// simulate api call with timeout
		$timeout(function() {
			GetByUserName(user.username)
				.then(function(duplicateUser) {
					if (duplicateUser !== null) {
						deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken'});
					} else {
						var users = getUsers();

						var lastUser = users[users.length - 1] || { id: 0 };
						user.id = lastUser.id + 1;

						users.push(user);
						setUsers(users);

						deferred.resolve({ success: true });
					}
				});
		}, 1000);

		return deferred.promise;
	};

	function getUsers() {
		if(!localStorage.users) {
			localStorage.users = JSON.stringify([]);
		}
		return JSON.parse(localStorage.users);
	};

	function setUsers(users) {
		localStorage.users = JSON.stringify(users);
	};
};
