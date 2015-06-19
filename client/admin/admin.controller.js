angular.module('app').controller('AdminController', [
	'$scope',
	'$meteor',
	'$timeout',
	function($scope, $meteor, $timeout) {
		
		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.resolve) {
				$scope.showSpinner();
			};
		});
		
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState.resolve) {
				$timeout(function() {
					$scope.hideSpinner();
				});
			};
		});
		
		$scope.showSpinner = function() {
			console.log('showing spinner');
		};
		
		$scope.hideSpinner = function() {
			console.log('hiding spinner');
		}
		
	}
]);