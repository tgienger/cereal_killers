angular.module('app').controller('HomeCtrl', [
	'$scope',
	function($scope) {
		
//		scroll to top of page on load
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
		
		$scope.closeComposer = function() {
	        $scope.synergyComposer.reset().close();
	    };
	
	
	}
]);