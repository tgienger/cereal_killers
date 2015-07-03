
var SettingsController = (function() {
	
	function SettingsController($scope, $meteor) {
		
		// subscribe to news settings
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('sitesettings').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.settings = $meteor.collection(SiteSettings);
			// console.log($scope.settings);
		});
		
	}
	
	return SettingsController;
	
}());

SettingsController.$inject = ['$scope', '$meteor'];

angular.module('app').controller('SettingsController', SettingsController);