
const STATEPARAMS = new WeakMap();
const ROOTSCOPE = new WeakMap();
const METEOR = new WeakMap();
const SCOPE = new WeakMap();

class DiscussionsController {
    static $inject = ['$meteor', '$stateParams', '$scope', '$rootScope'];
    constructor($meteor, $stateParams, $scope, $rootScope) {

        STATEPARAMS.set(this, $stateParams);
        ROOTSCOPE.set(this, $rootScope);
        METEOR.set(this, $meteor);
        SCOPE.set(this, $scope);

        // $scope.currentLocation = {
        //     header: $rootScope.siteName,
        //     link: '/home'
        // };

        // this.parent = new RegExp('^' + $stateParams.parent);
        this.parent = $stateParams.parent;
        this.page = 1;
        this.perPage = 25;
        this.sort = 1;
        this.pageReady = true;
        this.loaded = false;

        SCOPE.get(this).$meteorSubscribe('oneDiscussion', this.parent).then(() => {
            this.topic = $meteor.object(Discussions, {slug: this.parent}, false);
            // $scope.topic = this.topic;
            this.comment = $meteor.object(Comments, { slug: this.parent }, false);

    		this.commentCount = $meteor.object(Counts, 'numberOfComments', false);
            this.comments = $meteor.collection(Comments);

            console.log(this.comments);
        });
    }

    commentAuthor(comment) {
        if (comment) {
            var author = METEOR.get(this).object(Meteor.users, comment.author.id, false);
            return author;
        }
    }

    openComposer(post) {
        var replyPost = {
            reply: true,
            parent: post
        }
        ROOTSCOPE.get(this).composer.open(replyPost);
        // this.composer.open(replyPost);
    }


    saveComment(comment) {
        METEOR.get(this).call('saveComment', comment);
		// this.discussions.save(discussion);
		ROOTSCOPE.get(this).composer.close().reset();
    }

    addMoreComments() {
        if (this.loaded) {
            if (this.perPage < this.commentCount.count) {
                this.loaded = false;
                this.loadingMore = true;
                this.perPage += this.perPage;
            }
        }
    }

}

angular.module('app').controller('DiscussionsController', DiscussionsController);
