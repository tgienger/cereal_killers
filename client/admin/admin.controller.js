angular.module('app').controller('AdminController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		$scope.user = 'admin';
	}
]);