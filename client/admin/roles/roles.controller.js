angular.module('app').controller('RolesController', [
	'$scope',
	'$meteor',
	'$document',
	// 'roleData',
	'$timeout',
	function($scope, $meteor, $document, $timeout) {
		
		$scope.newRole = '';
		$scope.roles = $meteor.collection(Meteor.roles);
		// $scope.rules = roleData;
		
		// subscribe to rules
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('rules').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.rules = $meteor.collection(Rules);
			// console.log($scope.rules);
		});
		
		
		// $timeout(function() {
		// 	// end animation here
		// });
		
		
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
		
		$scope.editRole = function(role) {
			
			var oldName = role.name;
			
			swal({
				title: "Edit Role Name",
				text: "Change the name of this role",
				type: "input",
				showCancelButton: true,
				closeOnConfirm: false,
				inputPlaceholder: role.name 
			}, function(inputValue){
				if (inputValue === false) 
					return false;
				if (inputValue === "") {
					return false;
				}
				var newName = inputValue;
				swal({
					title: 'Are you sure?',
					text: 'Change ' + oldName + ' to ' + newName + ' ?',
					showCancelButton: true,
					closeOnConfirm: true,
					confirmButtonText: 'Yes, change the name.'
				}, function(confirm) {
					
					if (confirm) {
						if (oldName === newName) {
							return false;
						}			
						
						$meteor.call('editRole', oldName, newName).then(function(data) {
							Materialize.toast(oldName + ' changed to ' + newName , 4000);
						}, function(err) {
							Materialize.toast(err, 4000);
						});
					} else {
						return false;
					}
				})
			});
		};
		
		$scope.swal = swal;
		
	}
]);