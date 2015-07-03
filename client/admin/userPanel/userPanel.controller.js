
/**
 * User Panel Controller
 * returns UserPanelController
 */
var UserPanelController = (function() {
	
	/**
	 * Constructor
	 * @param: {ngular.$scope} $scope
	 * @param: {angular.$timeout} $timeout
	 * @param: {Meteor} $meteor
	 * @param: {angular.$rootScope} $rootScope
	 * @param: {angular.$interval} $interval
	 */
	function UserPanelController($scope, $timeout, $meteor, $rootScope, $interval) {

		// would normally be used to terminate the subscription
		// on scope.destroy, but with $meteorSubscribe it will do it automatically.
		var newsSubHandle;
		
		// Pagination variables
		// - not used yet -
		$scope.page = 1;
		$scope.perPage = $scope.limit || 20;
		$scope.sort = { latestDate: -1 };
		
		// subscribe to users collection
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('users').then(function(handle) {
				newsSubHandle = handle;
			});
			
			/**
			 * Meteor Cursor to user collection
			 */
			$scope.users = $meteor.collection(Meteor.users);
		});

		/**
		 * Meteor Cursor to roles collection
		 * subscription is automatic
		 */
		$scope.roles = $meteor.collection(Meteor.roles);
		
		
		/**
		 * Subscription to sitesettings
		 */
		$scope.$meteorSubscribe('sitesettings').then(function(handle) {
			var newsSettingsHandle = handle;
		});
		
		/**
		 * Meteor Cursor to the sitesettings collection
		 */
		$scope.settings = $meteor.object(SiteSettings, {});
		
		
		/**
		 * Add a user to a role
		 * @param: {string} userId
		 * @param: {string} roles
		 */
		function addRole(userId, roles) {
			$meteor.call('addUsersToRoles', userId, roles);
		}
		
		/**
		 * Remove a user from a role
		 * @param: {string} userId
		 * @param: {string} roles
		 */
		function removeRole(userId, roles) {
			$meteor.call('removeUsersFromRoles', userId, roles);
		}
		
		/**
		 * Process add/remove role request
		 * @param: {object} request
		 * @param: {object} user
		 * @param: {string} role
		 */
		function processRequest(request, user, role) {
			
			// If the users-roleConfirm setting from the admin/settings page is set to false
			// and we're not changing the admin status, then we can process the request without a
			// confirmation box.
			if ($scope.settings.users.roleConfirm === false && role !== 'admin') {
				request.cb(user._id, [role]);
				return;
			}
			
			/**
			 * SweetAlert confirmation
			 * Confirm to add/remove role to/from a user
			 */
			swal({
				title: 'Are you sure?',
				text: 'You are going to ' + request.type + ' ' + user.username + ' ' + request.text + ' role ' + role,
				type: 'warning',
				showCancelButton: true,
				confirmButtonCOlor: 'red',
				confirmButtonText: 'Confirm',
			}, function(confirmed) {
				if (confirmed) {
					
					// If confirmed, process the requests callback function
					request.cb(user._id, [role]);
				}
			});
		}
		
		$scope.addRole = function(ui, user) {
			var role = angular.element(ui.draggable).data('model');
			var request = {
				cb: addRole,
				'type': 'add',
				text: 'to'
			};
			processRequest(request, user, role.name);
		};
		
		$scope.removeRole = function(ui) {
			var model = angular.element(ui.draggable).data('model'),
				role = model.role,
				user = model.user,
				request = {
					cb: removeRole,
					'type': 'remove',
					text: 'from'
				};
			processRequest(request, user, role);
		};
		
		
		/**
		 * Send Confirmation Email
		 * @param: {object} user
		 */
		$scope.sendMail = function(user) {
			console.log(user);
		};
		
		
	}
	
	return UserPanelController;
	
}());

// Angular dependancy injection
UserPanelController.$inject = ['$scope', '$timeout', '$meteor', '$rootScope', '$interval'];

// Add UserPanelController to main app
angular.module('app').controller('UserPanelController', UserPanelController);