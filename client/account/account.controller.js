/**
 * Account Controller
 * return AccountController
 */
var AccountController = (function() {
	
	/**
	 * @constructor
	 * @param: {!angular.$scope} $scope
	 * @param: {$meteor} $meteor
	 * @param: {!angular.$rootScope} $rootScope
	 */
	function AccountController($scope, $meteor, $rootScope) {
		
		toastr.options = {
			tapToDismiss: true
		};
		
		/**
		 * @type: Object
		 * @description: We're going to copy the user object from
		 * angular-meteors $rootScope.currentUser
		 */
		this.user = {};
		this.user = angular.copy($rootScope.currentUser);
		
		/**
		 * Update profile function
		 * @param: {Object} user
		 */
		this.updateProfile = function(user) {
			
			// Prompt the user with a custom SweetAlert message
			swal({
				title: 'Update your profile?',
				closeOnConfirm: true,
				showCancelButton: true
			}, function(confirm) {
				
				// get confirmation from the user
				if (confirm) {
					/**
					 * Meteor Method Call - updateUserProfile
					 * @param: {Object} user
					 */
					$meteor.call('updateUserProfile', user).then(
						// on success send a custom toastr message
						function(data) {
							toastr.success('Profile Updated');
						},
						// on error, display in toatr message
						function(err) {
							toastr.error('Error: ' + err);
						}
					);
				} else {
					// if the user declines the update, return this.user to match original
					// angular-meteor user object.
					this.user = angular.copy($rootScope.currentUser);
				}
			});
		};
			
	}
	
	return AccountController;
	
}());

/**
 * Mail Controller
 * returns MailController
 */
var MailController = (function() {
	
	/**
	 * Mail Controller Constructor
	 * @param: {!angular.$scope} $scope
	 * @param: {$meteor} $meteor
	 * @param: {!angular.$rootScope} $rootScope
	 */
	function MailController($scope, $meteor, $rootScope) {
		this.user = {};
		this.user = angular.copy($rootScope.currentUser);
	}
	
	return MailController;
	
});

// Angular dependency injection
AccountController.$inject = ['$scope', '$meteor', '$rootScope'];
MailController.$inject = ['$scope', '$meteor', '$rootScope'];


// attatching controllers to the main app
angular.module('app')
.controller('AccountController', AccountController)
.controller('MailController', MailController);