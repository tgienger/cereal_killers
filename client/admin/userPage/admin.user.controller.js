/**
 * User Admin Controller
 * returns AdminUserController
 */
var AdminUserController = (function() {
	
	/**
	 * Constructor Function
	 * @param: {angular.$scope} $scope
	 */
	function AdminUserController($scope) {
		
		// Scroll to top of page when page loads,
		// just in case the page was scrolled down on last visit
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
		
	}
	
	return AdminUserController;
	
}());

// Angular dependancy injection - for minification purposes
AdminUserController.$inject = ['$scope'];

// Assign controller to app
angular.module('app')
.controller('AdminUserController', AdminUserController);