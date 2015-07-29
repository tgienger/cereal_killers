
/**
 * Forums Controller
 */

const ROOTSCOPE = new WeakMap();
const METEOR = new WeakMap();
const SCOPE = new WeakMap();

class ForumController {
    static $inject = ['$scope', '$meteor', '$rootScope'];
    constructor($scope, $meteor, $rootScope) {

        ROOTSCOPE.set(this, $rootScope);
        METEOR.set(this, $meteor);
        SCOPE.set(this, $scope);

        this.title = 'Forum Page';
        this.pageReady = true;
        
        SCOPE.get(this).page = 1;
        SCOPE.get(this).perPage = 25;
        SCOPE.get(this).sort = -1;

        $meteor.autorun($scope, () => {
            $meteor.autorun($scope, () => {
                $scope.$meteorSubscribe('discussions',{
                    limit: $scope.getReactively('perPage'),
                    skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
                    sort: { full_slug: $scope.getReactively('sort') } })
                    .then((handle) => {

                        this.discussions = $meteor.collection(() => {
                            return Discussions.find({}, {
                                sort: { full_slug: $scope.getReactively('sort') }
                            });
                        });

                });
            });
        });

        $scope.currentLocation = {
            header: $rootScope.siteName,
            link: '/home'
        }

    }


    openComposer() {
        this.composer.open();
    }


    /**
     * Saves the current Forum discussion in the discussions collection
     * @param  {object} discussion The newly created/edited discussion
     * @return {void 0}
     */
    saveDiscussion(discussion) {
        METEOR.get(this).call('saveDiscussion', discussion);
		// this.discussions.save(discussion);
		this.composer.close().reset();
    }
    
    removeDiscussion(discussion) {
        swal({
				title: 'Delete Discussion:',
				text: discussion.text,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'red',
				confirmButtonText: 'Delete',
			}, (confirmed) => {
				if (confirmed) {
                    METEOR.get(this).call('removeDiscussion', discussion);
				}
			});
    }
    
    isAdmin() {
        return Roles.userIsInRole(ROOTSCOPE.get(this).currentUser, ['admin', 'super moderator']);
    }
}


angular.module('app').controller('ForumController', ForumController);
