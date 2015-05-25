angular.module('app').controller('HomeCtrl', [
	'$scope',
	function($scope) {
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	}
]);