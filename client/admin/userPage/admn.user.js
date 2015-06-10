angular.module('app').config(['$stateProvider',
function($stateProvider) {
	
	// This function is a resolve to determine if the user has permission
    var isAuthorized = ['$q', '$timeout', '$http', '$state', '$rootScope', '$meteor', function($q, $timeout, $http, $state, $rootScope, $meteor){
        // Initialize a new promise
        var defer = $q.defer();

        $meteor.call('isUserAdmin').then(function(data) {
          defer.resolve();
        }, function (err) {
          defer.reject(err.reason);
        });
        return defer.promise;
    }];
	
	
	$stateProvider
		.state('admin-user', {
			url: '/admin/user',
			templateUrl: 'client/admin/userPage/admin.user.controller.ng.html',
			controller: 'AdminUserController',
    		resolve: {
                'currentUser': ['$meteor', function($meteor) {
                    return $meteor.requireValidUser(function(user) {
                        return Roles.userIsInRole(user._id, ['admin']);
                    });
                }]
            }
		});
}]);