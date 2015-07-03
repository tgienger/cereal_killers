/* global angular */

var AdminUserPanel = (function() {
	
	function AdminUserPanel() {
		return {
			restrict: 'E',
			// scope: {},
			controller: 'UserPanelController',
			templateUrl: 'client/admin/userPanel/userPanel.controller.ng.html',
			link: function(scope, element, attrs) {
				scope.limit = attrs.limit || 20;
			}
		}
	}
	return AdminUserPanel;
}());

angular.module('app').directive('adminUserPanel', AdminUserPanel);