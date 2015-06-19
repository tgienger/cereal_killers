angular.module('app')
.directive('rulesDir', [
	function() {
		return {
			restrict: 'AE',
			scope: {rules: '=', roles: '=', rule: '='},
			templateUrl: 'client/admin/roles/rules-directive/rules.directive.ng.html',
			link: function(scope, elem, attrs) {
				
				
				
				scope.addRole = function(rule, name, newRole) {
					swal({
						title: 'Add [' + newRole.name + '] to [' + name + '] ' + rule + '?',
						showCancelButton: true,
						closeOnConfirm: true
					}, function(confirm) {
						if (confirm) {
							_.each(scope.rules, function(el, index, list) {
								if (el.name === name) {
									var index = _.indexOf(scope.rules, el);
									if (_.indexOf(scope.rules[index][rule], newRole.name) > -1) {
										return false;
									}
									
									scope.rules[index][rule].push(newRole.name);
									scope.rules.save();
								}
							});
						}
					});			
				};
				
				scope.removeRole = function(rule, name, oldRule, _index) {
					if (oldRule === 'admin') {
						return false;
					}
					
					swal({
						title: 'Remove [' + oldRule + '] from [' + name + '] ' + rule + '?',
						showCancelButton: true,
						closeOnConfirm: true
					}, function(confirm) {
						if (confirm) {
							_.each(scope.rules, function(el, index, list) {
								
								if (el.name === name) {
									
									var i = _.indexOf(scope.rules, el);
									scope.rules[i][rule].splice(_index, 1);
									scope.rules.save();
								}
								
							});
						}
					});
				};
			}
		};
	}
])