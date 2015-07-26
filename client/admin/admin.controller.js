angular.module('app').controller('AdminController', [
	'$scope',
	'$meteor',
	'$timeout',
	'$rootScope',
	function($scope, $meteor, $timeout, $rootScope) {
		

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.resolve) {
				$scope.showSpinner();
			};
		});

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState.resolve) {
				$timeout(function() {
					$scope.hideSpinner();
				});
			};
		});

		$scope.showSpinner = function() {
			// console.log('showing spinner');
			$scope.loading = true;
		};

		$scope.hideSpinner = function() {
			// console.log('hiding spinner');
			$scope.loading = false;
		};


		$scope.adminNav = [
			{
				route: 'admin.settings',
				name: 'Settings',
				'if': function() {
					return true;
				}
			},
			{
				route: 'admin.users',
				name: 'Users',
				'if': function() {
					return true;
				}
			},
			{
				route: 'admin.roles',
				name: 'Roles',
				'if': function () {
					return true;
				}
			},
			{
				route: 'admin.vpn',
				name: 'VPN Access',
				'if': function() {
					return $rootScope.currentUser.username === 'webmaster';
				}
			}
		];

	}
]);
