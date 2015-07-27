/// <reference path="../../../typings/tsd.d.ts" />


class SettingsController {
	
	static $inject = ['$scope', '$meteor'];
	constructor($scope, $meteor) {
		$meteor.autorun($scope, () => {
			$scope.$meteorSubscribe('sitesettings').then(() => {
				this.settings = $meteor.collection(SiteSettings);
			});
		});
	}
}


//var SettingsController = (function() {
//	
//	function SettingsController($scope, $meteor) {
//		
//		// subscribe to news settings
//		$meteor.autorun($scope, function() {
//			$scope.$meteorSubscribe('sitesettings').then(function(handle) {
//				var newsSettingsHandle = handle;
//			});
//			
//			$scope.settings = $meteor.collection(SiteSettings);
//			// console.log($scope.settings);
//		});
//		
//	}
//	
//	return SettingsController;
//	
//}());
//
//SettingsController.$inject = ['$scope', '$meteor'];
//
angular.module('app').controller('SettingsController', SettingsController);