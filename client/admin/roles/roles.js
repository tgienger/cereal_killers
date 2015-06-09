angular.module('app').config(['$stateProvider',
function($stateProvider) {


	// This function is a resolve to determine if the user has permission
    var isAuthorized = ['$q', '$timeout', '$http', '$state', '$rootScope', '$meteor', function($q, $timeout, $http, $state, $rootScope, $meteor){
        // Initialize a new promise
        // var defer = $q.defer();

        $meteor.call('isUserAdmin').then(function(data) {
          // defer.resolve();
          console.log(data);
          return true;
        }, function (err) {
          // defer.reject(err.reason);
          return false;
        });
        // return defer.promise;
    }];
    
    	
	$stateProvider
		.state('admin-roles', {
			url: '/admin/roles',
			templateUrl: 'client/admin/roles/roles.controller.ng.html',
			controller: 'RolesController',
			resolve: {
                'currentUser': ['$meteor', function($meteor) {
                    return $meteor.requireValidUser(function(user) {
                        return Roles.userIsInRole(user._id, ['admin']);
                    });
                }]
            }
		});
}]);

