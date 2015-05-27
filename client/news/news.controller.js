angular.module('app').controller('NewsCtrl', [
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
		$scope.perPage = 25;
		$scope.sort = { latestDate: -1 };
		
		// subscribe to the news posts.
		$meteor.autorun($scope, function() {
			$meteor.subscribe('news', {visible: true}, {
				limit: $scope.getReactively('perPage'),
				skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
				sort: $scope.getReactively('sort')
			}).then(function(handle) {
				newsSubHandle = handle;
			});
		});
		
		$scope.posts = $meteor.collection(function() {
			return News.find({}, {
				sort: $scope.getReactively('sort')
			});
		});
	}
]);