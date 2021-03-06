/* global angular */

function ForumConfig($stateProvider, $urlMatcherFactoryProvider) {
	$urlMatcherFactoryProvider.strictMode(false);

	$stateProvider
		.state('forum', {
			url: '/forum',
			templateUrl: 'client/forum/forum.controller.ng.html',
			controllerAs: 'forum',
			controller: 'ForumController',
			resolve: {
				'currentUser': ['$meteor', function($meteor) {
					return $meteor.waitForUser();
				}]
			}
		});
}

ForumConfig.$inject = ['$stateProvider', '$urlMatcherFactoryProvider'];

angular.module('app').config(ForumConfig);
