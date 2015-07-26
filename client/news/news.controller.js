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
				$scope.newsCount = $meteor.object(Counts ,'newsCount', false);

	//			insert the news posts into this array
				$scope.posts = $meteor.collection(function() {
					return News.find({}, {
						sort: $scope.getReactively('sort')
					});
				}, false);
				
			});


		});

//		Save a new news post
		$scope.saveNews = function(news) {

			if (!news.subject) {
//				TODO: Let the users know what they're missing. Maybe flashing the input or textarea
				swal("Oops..", "You forgot the title!", "error");
				return void 0;
			}
			if (!news.markdown) {
				swal("really..", "You forgot the body of the post.", "error")
				return void 0;
			}

			$scope.posts.save(news, function(err) {
				if (err) {
					console.log(err);
				}
				console.log('callback');
			});
			$scope.composer.close().reset();
		};

		// edit post
		$scope.edit = function(post) {
			$scope.composer.edit(post);
		}

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
					// Materialize.toast('Post deleted!', 4000)
				}
			});
		};



//		close inputbox
		$scope.closeInput = function() {
			$scope.composer.close().reset();
		};

		$scope.openCreate = function() {
			$scope.composer.open();
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


// Template.mdTemplate.helpers({
// 	md: function() {
// 		return Template.currentData().getReactively('composer.post.markdown');
// 	}
// });
