class Run {

	static $inject = ['$rootScope', '$state'];
	constructor($rootScope, $state) {
		$rootScope.$state = $state;

		$rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {

			/**
			 * If the route requires authentication
			 * we'll send them home if they don't
			 * qualify
			 */
			 if (error === 'AUTH_REQUIRED') {
				 event.preventDefault();
				 $state.go('home');
			 }

		});

		$rootScope.$watch('currentUser', u => {
			if (u === null) {
				$state.go('home');
			}
		});

	}
}

function Config($stateProvider, $locationProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/home');
}
Config.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
angular.module('app').run(() => Run).config(Config);
