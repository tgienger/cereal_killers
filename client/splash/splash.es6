function SplashConfig($stateProvider) {
	$stateProvider
		.state('splash', {
			url: '/splash',
			templateUrl: 'client/splash/splash.controller.ng.html',
			controller: 'SplashCtrl'
		});
}
SplashConfig.$inject = ['$stateProvider'];
angular.module('app').config(SplashConfig);