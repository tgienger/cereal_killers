angular.module('app').directive('chatPanel', function() {
	return {
		restrict: 'E',
		scope: {},
		controller: 'ChatController',
		templateUrl: 'client/chat/chat.controller.ng.html',
		link: function(scope, element, attrs) {
		}
	};
});