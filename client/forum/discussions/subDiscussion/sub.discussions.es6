
class SubDiscussionsController {
	
	static $inject = ['$meteor', '$scope', '$stateParams'];
	constructor($meteor, $scope, $stateParams) {
		
        this.parent = $stateParams.parent;
        this.child = $stateParams.parent + '/' + $stateParams.child;
        
        this.page = 1;
        this.perPage = 25;
        this.sort = 1;
        this.pageReady = true;
        this.loaded = false;

        $scope.$meteorSubscribe('subDiscussion', this.parent, this.child).then(() => {
            this.topic = $meteor.object(Discussions, {slug: this.parent}, false);
            // $scope.topic = this.topic;
            this.comment = $meteor.object(Comments, { slug: this.child }, false);
            console.log(this.comment);
    		this.commentCount = $meteor.object(Counts, 'numberOfComments', false);
//            this.comments = $meteor.collection(Comments);
            
        });
	}
}

angular.module('app').controller('SubDiscussionsController', SubDiscussionsController);