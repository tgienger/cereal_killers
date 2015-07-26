var Controller = (function() {

	function Controller($scope, $rootScope) {
		$scope.$on('$stateChangeSuccess', function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
		$scope.currentLocation = {
			header: $rootScope.siteName,
			link: '/home'
		};

	}

	return Controller;
}());

Controller.$inject = ['$scope', '$rootScope'];

angular.module('app').controller('HomeCtrl', Controller);
