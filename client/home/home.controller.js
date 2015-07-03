var Controller = (function() {
	
	function Controller($scope) {
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	}
	
	return Controller;
}());

Controller.$inject = ['$scope'];

angular.module('app').controller('HomeCtrl', Controller);