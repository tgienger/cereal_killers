angular.module('app').controller('UserPanelController', [
	'$scope',
	'$timeout',
	'$meteor',
	'$rootScope',
	'$interval',
	function($scope, $timeout, $meteor, $rootScope, $interval) {

		// globals
		var newsSubHandle;
		
		// scope variables
		$scope.page = 1;
		$scope.perPage = $scope.limit || 20;
		$scope.sort = { latestDate: -1 };
		$scope.createPost = false;
		
//		 subscribe to the news posts.
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('users').then(function(handle) {
				newsSubHandle = handle;
			});
			
//			insert the news posts into this array
			$scope.users = $meteor.collection(Meteor.users);
		});

		
		$scope.roles = $meteor.collection(Meteor.roles);
		
		
		$scope.$meteorSubscribe('sitesettings').then(function(handle) {
			var newsSettingsHandle = handle;
		});
		
		$scope.settings = $meteor.object(SiteSettings, {});
		
		function addRole(user, roles) {
			$meteor.call('addUsersToRoles', user, roles);
		}
		
		function removeRole(user, roles) {
			$meteor.call('removeUsersFromRoles', user, roles);
		}
		
		
		$scope.removeUsersFromRoles = function(user, role) {
			
			if ($scope.settings.users.roleConfirm === false && role !== 'admin') {
				removeRole(user._id, [role]);
				return;
			}
			
			swal({
				title: 'Are you sure?',
				text: 'You are going to remove ' + user.username + ' from role ' + role,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'red',
				confirmButtonText: 'Yes, remove role',
			}, function(confirmed) {
				if (confirmed) {
					removeRole(user._id, [role]);
				}
			});
		};
		$scope.addUsersToRoles = function(user, role) {
			
			if ($scope.settings.users.roleConfirm === false && role.name !== 'admin') {
				addRole(user._id, [role.name]);
				return;
			}
			
			swal({
				title: 'Are you sure?',
				text: 'You are about to grant ' + user.username + ' with the role of ' + role.name,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'red',
				confirmButtonText: 'Yes, add role',
			}, function(confirmed) {
				if (confirmed) {
					addRole(user._id, [role.name]);
				}
			});
			
		};
		
		$scope.roleClicked = function(role) {
			console.log(role);
		};
		
		
		$scope.containsRole = function(user, role) {
			if (_.contains(user.roles, role.name)) {
				return true;
			} else {
				return false
			}
		};
		
		
//		check if user is admin
		$scope.userIsAdmin = function() {
			if (!$rootScope.currentUser) {
				return false;
			}
			var userId = $rootScope.currentUser._id;
			return Roles.userIsInRole(userId, ['admin']);
		};
		
		$scope.adminRole = function(user) {
			return _.indexOf(user.roles, 'admin') > -1;
		};
		
		
		angular.element(document).ready(function() {
	        $scope.pageReady = true;
	    });
		
		$scope.sendMail = function(user) {
			console.log(user);
		};
		
		$scope.addRole = function(ui, user) {
			var role = angular.element(ui.draggable).data('model');
			$scope.addUsersToRoles(user, role);
		};
		
		$scope.removeRole = function(ui) {
			var model = angular.element(ui.draggable).data('model'),
				role = model.role,
				user = model.user;
			$scope.removeUsersFromRoles(user, role);
		};
		
	}
]);