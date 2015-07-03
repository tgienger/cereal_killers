angular.module('app').config(['$stateProvider',
function($stateProvider) {
	$stateProvider
		.state('splash', {
			url: '/splash',
			templateUrl: 'client/splash/splash.controller.ng.html',
			controller: 'SplashCtrl'
		});
}]);