angular.module('app').config(['$stateProvider',
function($stateProvider) {
    	
	$stateProvider
		.state('admin-settings', {
			url: '/admin/settings',
			templateUrl: 'client/admin/settings/settings.controller.ng.html',
			controller: 'SettingsController',
			resolve: {
                'currentUser': ['$meteor', function($meteor) {
                    return $meteor.requireValidUser(function(user) {
                        return Roles.userIsInRole(user._id, ['admin']);
                    });
                }]
            }
		});
}]);

