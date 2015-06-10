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
		$scope.perPage = $scope.limit || 20;
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
		
//		Save a new news post
		$scope.save = function(news) {
			
			
			if (!news.subject || !news.markdown) {
//				TODO: Let the users know what they're missing. Maybe flashing the input or textarea
				sweetAlert("Oops..", "You've forgotten something", "error");
				return;
			}
			
			
			var newNews = {
				title: news.subject,
				body: news.markdown,
				private: true
			};
			
			// if (!news.private) {
			// 	news.private = false;
			// }
			
//			TODO: reset composer text and close it when saved.
			$scope.posts.save(newNews);
			$scope.synergyComposer.reset().close();
//			this.news = {};
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
		
		
		
//		close inputbox
		$scope.closeInput = function() {
			$scope.synergyComposer.reset().close();
		};
		
		$scope.openCreate = function() {
			$scope.synergyComposer.open();
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