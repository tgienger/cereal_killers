angular.module('app').controller('AdminUserController', [
	'$scope',
	function($scope) {
		
//		scroll to top of page on load
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	
	}
]);