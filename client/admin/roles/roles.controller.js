
/**
 * Roles Controller
 * returns RolesController
 */
var RolesController = (function() {
	
	/**
	 * RolesController constructor
	 * @param: {angular.$scope} $scope
	 * @param: {Meteor} $meteor
	 * @param: {angular.$document} $document
	 * @param: {angular.$timeout} $timeout
	 */
	function RolesController($scope, $meteor, $document, $timeout) {
		
		toastr.options = {
			tapToDismiss: true
		};
		
		/**
		 * current rule to be placed in header
		 * {Object}
		 */
		this.currentRule = {name: ''};
		
		/**
		 * sets the current rule
		 * @param: {object} rule
		 */
		this.setCurrentRule = function(rule) {
			var _this = this;
			$scope.$apply(function() {
				_this.currentRule.name = rule !== '' ?  '-' + rule + '- ' : '';
			});
		};
		
		/**
		 * set roles loading spinner to true at start
		 */
		this.loading = true;
		/**
		 * set roles loading spinner to false
		 * at the end of initial $apply
		 */
		$timeout(function() {
			_this.loading = false;
		}, 0, _this = this);
		
		
		/**
		 * roles: Object
		 * @description: A Meteor Cursor to the roles collection
		 */
		this.roles = $meteor.collection(Meteor.roles);
		
		
		/**
		 * Subscribing to Meteor 'rules'collection
		 */
		$scope.$meteorSubscribe('rules').then(function(handle) {
			_this.rules = $meteor.collection(Rules);
		}, _this = this);
		
		
		/**
		 * newRole: String
		 */
		this.newRole = '';
		
		// remove role
		this.deleteRole = function(role) {
			var _this = this;
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
					_this.newRole = '';
				}
			});
			
		};
		
		
		// create role
		this.createRole = function(role) {
			var _this = this;
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
					_this.newRole = '';
				}
			});
			
		};
		
		this.editRole = function(role) {
			var_this = this,
				oldName = role.name;
			
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
							toastr.success(oldName + ' changed to ' + newName);
							
							_.each(_this.rules, function(rule) {
								_.each(rule, function(r) {
									if (Object.prototype.toString.call(r) === '[object Array]') {
										var index = _.indexOf(r, oldName);
										r[index] = newName;
									}
								});
							});
							
						}, function(err) {
							toastr.error(err);
						});
					} else {
						return false;
					}
				})
			});
		};
		
		$scope.swal = swal;
		

		this.addRole = function(rule, ui, name) {
			var _this = this;
			var role = angular.element(ui.draggable).data('model');
			swal({
				title: 'Add [' + role.name + '] to [' + name + '] ' + rule + '?',
				showCancelButton: true,
				closeOnConfirm: true
			}, function(confirm) {
				if (confirm) {
					_.each(_this.rules, function(el, index, list) {
						if (el.name === name) {
							var index = _.indexOf(_this.rules, el);
							if (_.indexOf(_this.rules[index][rule], role.name) > -1) {
								return false;
							}
							
							_this.rules[index][rule].push(role.name);
							_this.rules.save();
							toastr.success(role.name + ' added to ' + name);
						}
					});
				}
			});			
		};
		
		this.removeRole = function(rule, name, oldRule, _index) {
			var _this = this;
			if (oldRule === 'admin') {
				return false;
			}
			
			swal({
				title: 'Remove [' + oldRule + '] from [' + name + '] ' + rule + '?',
				showCancelButton: true,
				closeOnConfirm: true
			}, function(confirm) {
				if (confirm) {
					_.each(_this.rules, function(el, index, list) {
						
						if (el.name === name) {
							
							var i = _.indexOf(_this.rules, el);
							_this.rules[i][rule].splice(_index, 1);
							_this.rules.save();
							toastr.success(oldRule + ' removed from ' + name);
						}
						
					});
				}
			});
		};
		
	}
	
	return RolesController;
	
}());

// Angular dependency injection - for minification
RolesController.$inject = ['$scope','$meteor','$document','$timeout'];

// assign Roles Controller to app
angular.module('app')
.controller('RolesController', RolesController);