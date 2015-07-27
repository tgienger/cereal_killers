
var AdminConfig = (function() {

	function AdminConfig($stateProvider, $urlMatcherFactoryProvider) {
		$urlMatcherFactoryProvider.strictMode(false);

		$stateProvider
			.state('admin', {
				url: '/admin',
				templateUrl: 'client/admin/admin.controller.ng.html',
				controller: 'AdminController',
				resolve: {
	                'isAdmin': ['$meteor', function($meteor) {
	                    return $meteor.requireValidUser(function(user) {
	                        return Roles.userIsInRole(user._id, ['admin']);
	                    });
	                }]
	            }
			})
			.state('admin.users', {
				url: '/users',
				templateUrl: 'client/admin/userPage/admin.user.controller.ng.html',
				controller: 'AdminUserController',
				// resolve: {
				// 	'users': ['$meteor', '$q', function($meteor, $q) {

				// 		var deferred = $q.defer();

				// 		$meteor.subscribe('users').then(function() {
				// 			deferred.resolve($meteor.collection(Meteor.users));
				// 		});

				// 		return deferred.promise;

				// 	}].
				// }
			})
			.state('admin.roles', {
				url: '/roles',
				templateUrl: 'client/admin/roles/roles.controller.ng.html',
				controllerAs: 'userRoles',
				controller: 'RolesController',
				resolve: {
					'roleData': ['$meteor', '$q', function($meteor, $q) {

						var deferred = $q.defer();

						$meteor.subscribe('rules').then(function() {
							deferred.resolve($meteor.collection(Rules));
						});

						return deferred.promise;
						// return $meteor.collection(Meteor.roles);
					}]
				}
			})
			.state('admin.settings', {
				url: '/settings',
				templateUrl: 'client/admin/settings/settings.controller.ng.html',
				controllerAs: 'settings',
				controller: 'SettingsController',
			})
			.state('admin.vpn', {
				url: '/vpn',
				templateUrl: 'client/admin/vpn/vpn.ng.html',
				controller: 'VpnController'
			});

	}
    return AdminConfig;
}());

AdminConfig.$inject = ['$stateProvider', '$urlMatcherFactoryProvider'];

angular.module('app').config(AdminConfig);
