
/**
 * Forums Controller
 */

class ForumController {
    static $inject = ['$scope', '$meteor'];
    constructor($scope, $meteor) {
        this.title = 'Forum Page';
        this.page = 1;
        this.perPage = 25;
        this.sort = -1;

        $meteor.autorun($scope, () => {
            $meteor.autorun($scope, () => {
                $scope.$meteorSubscribe('discussions',{
                    limit: $scope.getReactively('perPage'),
                    skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
                    sort: { full_slug: $scope.getReactively('sort') } }).then(function (handle) {
                });
                this.discussions = $meteor.collection(() => {
                    return Discussions.find({}, {
                        sort: { full_slug: $scope.getReactively('sort') }
                    });
                });
            });
        });

    }


    newPost() {
      console.log('create new post');
    }
}


angular.module('app').controller('ForumController', ForumController);
