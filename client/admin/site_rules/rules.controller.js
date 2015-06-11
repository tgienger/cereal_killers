angular.module('app')
.controller('RulesController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		
		// subscribe to news settings
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('rules').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.rules = $meteor.collection(Rules);
			console.log($scope.rules);
		});
		
	}
]);