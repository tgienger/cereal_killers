angular.module('app').controller('RolesController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		
		$scope.newRole = '';
		$scope.roles = $meteor.collection(Meteor.roles);
		
		
		// subscribe to rules
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('rules').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.rules = $meteor.collection(Rules);
			console.log($scope.rules);
		});
		
		
		// remove role
		$scope.deleteRole = function(role) {
			if (!role)
				return;
			swal({
				title: 'Are you sure?',
				text: 'You are going to remove role: ' + role,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'red',
				confirmButtonText: 'Yes, remove role',
			}, function(confirmed) {
				if (confirmed) {
					Roles.deleteRole(role);
					$scope.newRole = '';
				}
			});
			
		};
		
		
		// create role
		$scope.createRole = function(role) {
			if (!role)
				return;
			swal({
				title: 'Are you sure?',
				text: 'You are going to create role: ' + role,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'red',
				confirmButtonText: 'Yes, create role',
			}, function(confirmed) {
				if (confirmed) {
					Roles.createRole(role);
					$scope.newRole = '';
				}
			});
			
		};
	}
]);