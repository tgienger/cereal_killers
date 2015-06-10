angular.module('app').config(['$stateProvider',
function($stateProvider) {
    	
	$stateProvider
		.state('admin', {
			url: '/admin',
			templateUrl: 'client/admin/admin.controller.ng.html',
			controller: 'AdminController',
			resolve: {
                'currentUser': ['$meteor', function($meteor) {
                    return $meteor.requireValidUser(function(user) {
                        return Roles.userIsInRole(user._id, ['admin']);
                    });
                }]
            }
		});
}]);

