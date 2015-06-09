angular.module('app').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
			.state('news', {
				url: '/news',
				templateUrl: 'client/news/newsfeed.controller.ng.html',
				controller: 'NewsCtrl'
			});
	}
]);	