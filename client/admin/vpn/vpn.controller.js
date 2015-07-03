angular.module('app')
.controller('VpnController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		$scope.addVpnUser = function(user) {
			$meteor.call('addVpnUser', user).then(
				function(data) {
					console.log('Returned: ' + data);
				}, function(err) {
					console.log('Error: ' + err);
			});
		};
	}
]);