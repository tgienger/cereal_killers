/* global angular */
angular.module('app').directive('adminUserPanel', function() {
	return {
		restrict: 'E',
		scope: {},
		controller: 'UserPanelController',
		templateUrl: 'client/admin/userPanel/userPanel.controller.ng.html',
		link: function(scope, element, attrs) {
			scope.limit = attrs.limit || 20;
		}
	}
});