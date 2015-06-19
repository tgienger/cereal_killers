angular.module('app').controller('AccountController', [
	'$scope',
	'$meteor',
	'$rootScope',
	function($scope, $meteor, $rootScope) {
		
		$scope.user = {};
		$scope.user = angular.copy($rootScope.currentUser);
		
		$scope.updateProfile = function(user) {
			swal({
				title: 'Update your profile?',
				closeOnConfirm: true,
				showCancelButton: true
			}, function(confirm) {
				if (confirm) {
					$meteor.call('updateUserProfile', user).then(
						function(data) {
							Materialize.toast('Profile Updated', 4000);
						},
						function(err) {
							Materialize.toast('Error: ' + err, 4000);
						}
					);
				} else {
					$scope.user = angular.copy($rootScope.currentUser);
				}
			});
		};
	}
])
.controller('MailController', [
	'$scope',
	'$meteor',
	function($scope, $meteor) {
		
	}
]);