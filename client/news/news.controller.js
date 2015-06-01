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
			$scope.$meteorSubscribe('news', {visible: true}, {
				limit: $scope.getReactively('perPage'),
				skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
				sort: $scope.getReactively('sort')
			}).then(function(handle) {
				newsSubHandle = handle;
			});
			
//			insert the news posts into this array
			$scope.posts = $meteor.collection(function() {
				return News.find({}, {
					sort: $scope.getReactively('sort')
				});
			});
		});
		
		console.log($scope.posts);
//		Save a new news post
		$scope.save = function(news) {
			if (!news.title || !news.body) {
//				TODO: Let the users know what they're missing. Maybe flashing the input or textarea
				console.log('not saved');
				return;
			}
			
			if (!news.private) {
				news.private = false;
			}
			$scope.posts.save(news);
			this.news = {};
		};
		
//		delete post
		$scope.deletePost = function(news) {
			if (news.visible) {
				news.visible = false;
			} else {
				news.visible = true;
			}
			$scope.posts.save(news);
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
			if ($scope.createPost) {
				$scope.synergyComposer.open();
			} else {
				$scope.synergyComposer.close();
			}
			$scope.reset();
			
		};
		
//		check if user is admin
		$scope.userIsAdmin = function() {
			if (!$rootScope.currentUser) {
				return false;
			}
			var userId = $rootScope.currentUser._id;
			return Roles.userIsInRole(userId, ['admin']);
		};
		
		
		angular.element(document).ready(function() {
	        $scope.pageReady = true;
	    });
		
	}
]);