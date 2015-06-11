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
			
			
			if (!news.subject) {
//				TODO: Let the users know what they're missing. Maybe flashing the input or textarea
				swal("Oops..", "You forgot the subject!", "error");
				return;
			}
			if (!news.markdown) {
				swal("really..", "You forgot the body of the post!", "error")
				return;
			}
			
			
			var newNews = {
				title: news.subject,
				body: news.markdown
			};
			
//			TODO: reset composer text and close it when saved.
			$scope.posts.save(newNews);
			$scope.synergyComposer.reset().close();
		};
		
//		delete post
		$scope.deletePost = function(news) {
			swal({
				title: "Are you sure?",   
				text: "You will not be able to recover this post!",   
				type: "warning",   
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Yes, delete it!",
			}, function(confirmed){   
				if (confirmed) {
					$scope.posts.remove(news);
					Materialize.toast('Post deleted!', 4000)
				} 
			});
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