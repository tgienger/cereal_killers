/* global angular */
angular.module('app')
.run(["$rootScope", "$state",
function($rootScope, $state) {
	
	$rootScope.$state = $state;
	
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		
		// if the route requires authentication
		// lets send them home instead
		if (error === 'AUTH_REQUIRED') {
			event.preventDefault();
			$state.go('home');
		}
		
	});
	
	$rootScope.$watch('currentUser', function(u) {
		if (u === null) {
			$state.go('home');
		}
	});
}])
.config([
	'$stateProvider',
	'$locationProvider',
	'$urlRouterProvider',
	function($stateProvider, $locationProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
		
		$urlRouterProvider.otherwise('/home');
	}
]);