
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

        this.page = 1;
        this.perPage = 25;
        this.sort = 1;
        
        this.parent = $stateParams.parent;
        this.pageReady = true;
        this.loaded = false;
        
        $scope.page = 1;
        $scope.perPage = 25;
        $scope.sort = 1;
        
        $meteor.autorun($scope, () => {
            $meteor.autorun($scope, () => {
                $scope.$meteorSubscribe('oneDiscussion', this.parent, {
                    limit: $scope.getReactively('perPage'),
                    skip: parseInt(($scope.getReactively('page') - 1) * $scope.getReactively('perPage')),
                    sort: { full_slug: $scope.getReactively('sort') } })
                    .then(() => {
                        this.topic = $meteor.object(Discussions, {slug: this.parent}, false);
                        // $scope.topic = this.topic;
                        this.comment = $meteor.object(Comments, { slug: this.parent }, false);
            
                		this.commentCount = $meteor.object(Counts, 'numberOfComments', false);
                        
                        this.comments = $meteor.collection(() => {
                            return Comments.find({}, {sort: {full_slug: $scope.getReactively('sort')}});
                        });
                        
						if (this.loaded !== undefined) {
							this.loaded = true;
							if (this.loadingMore !== undefined) {
								this.loadingMore = false;
							}
						}
                });
            });
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
            if (SCOPE.get(this).perPage < this.commentCount.count) {
                this.loaded = false;
                this.loadingMore = true;
                SCOPE.get(this).perPage += SCOPE.get(this).perPage;
            }
        }
    }

}

angular.module('app').controller('DiscussionsController', DiscussionsController);
