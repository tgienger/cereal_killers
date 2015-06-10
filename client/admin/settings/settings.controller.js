angular.module('app').controller('SettingsController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		
		
		
		// subscribe to news settings
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('sitesettings').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.settings = $meteor.collection(SiteSettings);
			// console.log($scope.settings);
		});
		
	}
]);