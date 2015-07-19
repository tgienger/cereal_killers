
class DiscussionsController {
    static $inject = ['$meteor', '$stateParams', '$scope'];
    constructor($meteor, $stateParams, $scope) {

        // this.parent = new RegExp('^' + $stateParams.parent);
        this.parent = $stateParams.parent;
        this.page = 1;
        this.perPage = 25;
        this.sort = 1;

        $scope.$meteorSubscribe('discussions').then(() => {
            this.topic = $meteor.object(Discussions, {slug: this.parent}, false);
        });


        $scope.$meteorSubscribe('comments').then(() => {
            this.comment = $meteor.object(Comments, {slug: this.parent}, false);
        });
    }

}

angular.module('app').controller('DiscussionsController', DiscussionsController);
