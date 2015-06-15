angular.module('app').controller('RolesController', [
	'$scope',
	'$meteor',
	'$document',
	function($scope, $meteor, $document) {
		
		$scope.newRole = '';
		$scope.roles = $meteor.collection(Meteor.roles);
		// console.log($scope.roles);
		
		// subscribe to rules
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('rules').then(function(handle) {
				var newsSettingsHandle = handle;
			});
			
			$scope.rules = $meteor.collection(Rules);
			// console.log($scope.rules);
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
		
		
		$scope.addNewRole = function(rule, name, newRole) {
			
			// _.each($scope.rules, function(el, index, list) {
			// 	if (el.name === name) {
			// 		var index = _.indexOf($scope.rules, el);
			// 		if (_.indexOf($scope.rules[index][rule], newRole) < 0) {
			// 			return false;
			// 		}
			// 	}
			// });
			
			swal({
				title: 'Add [' + newRole.name + '] to ['+ name + '] ' + rule + '?',
				showCancelButton: true,
				closeOnConfirm: true
			}, function(confirm) {
				if (confirm) {
					_.each($scope.rules, function(el, index, list) {
						if (el.name === name) {
							var index = _.indexOf($scope.rules, el);
							if (_.indexOf($scope.rules[index][rule], newRole.name) > -1) {
								return false;
							}
							
							$scope.rules[index][rule].push(newRole.name);
							$scope.rules.save();
						}
					});
				}
			});			
		};
		
		
		$scope.removeRole = function(rule, name, oldRule, _index) {
			
			if (oldRule === 'admin') {
				return false;
			}
			
			swal({
				title: 'Remove [' + oldRule + '] from [' + name + '] ' + rule + '?',
				showCancelButton: true,
				closeOnConfirm: true
			}, function(confirm) {
				if (confirm) {
					_.each($scope.rules, function(el, index, list) {
						
						if (el.name === name) {
							
							var i = _.indexOf($scope.rules, el);
							$scope.rules[i][rule].splice(_index, 1);
							$scope.rules.save();
						}
						
					});
				}
			});
		};
		
		// $document.ready(function(that) {
		// 	console.log(that);
		// });
	}
]);