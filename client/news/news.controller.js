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
		$scope.createPost = false;
		
//		 subscribe to the news posts.
		$meteor.autorun($scope, function() {
			$meteor.subscribe('news', {visible: true}, {
				limit: $scope.getReactively('perPage'),
				skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
				sort: $scope.getReactively('sort')
			}).then(function(handle) {
				newsSubHandle = handle;
			});
		});
		
//		insert the news posts into this array
		$scope.posts = $meteor.collection(function() {
			return News.find({}, {
				sort: $scope.getReactively('sort')
			});
		});
		
//		Save a new news post
		$scope.save = function(news) {
			$scope.posts.save(news);
			$scope.reset();
		};
		
//		reset
		$scope.reset = function() {
			this.news = {};
		};
		
//		close inputbox
		$scope.closeInput = function() {
			angular.element('.inputForm').addClass('closed');
		};
		
		$scope.openCreate = function() {
			$scope.createPost = !$scope.createPost;
		};
		
		$scope.userIsAdmin = function() {
			$meteor.call('isAdmin').then(
				function(data) {
					return data;
				},
				function(err) {
					console.log('failed', err);
				}
			)
		};
	}
]);