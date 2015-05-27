/* global angular */
angular.module('app').directive('newsPanel', function() {
	return {
		restrict: 'E',
		scope: {},
		controller: 'NewsCtrl',
		templateUrl: 'client/news/news.controller.ng.html',
		link: function(scope, element, attrs) {
			scope.limit = attrs.limit || 20;
		}
	}
});