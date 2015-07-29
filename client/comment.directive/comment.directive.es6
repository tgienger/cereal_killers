/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Comment Directive
 */

function CommentDirective(RecursionHelper, $meteor, $stateParams, $rootScope) {
	return {
		restrict: 'E',
		scope: { parent: '=', perPage: '=', page: '=', sort: '=', innerComment: '=', parentRe: '=', reply: '&reply', loaded: '=', loadingMore: '=' },
		templateUrl: 'client/comment.directive/comment.directive.ng.html',
		compile: (element) => {
		    return RecursionHelper.compile(element, (scope, iElem, iAttrs, commentsController) => {
				/**
		         * Using meteor autorun to autocompile scope variables when they've changed
		         * this allows us to use Sort, perPage and page to determine
		         * which comments we're looking at.
		         */
		        $meteor.autorun(scope, () => {
					/**
					 * scope.$meteorSubscribe instead of $mteor.subscribe will automatically end the subscription when the scope is
					 * destroyed.
					 * @param  {string} 'comments' name of the collection we're subscribing to
					 * @param  {boolean} visible:  not grabbing any comments that are 'deleted'
					 * @param  {string} parent_id: mongo _id of the parent discussion
					 * @param  {number} limit:     how many 'per page' you'd like to see
					 * @param  {number} sort	   how we sort the collection before retrieving it, here we're sorting by full_slug and -1 so we get the newest on top
					 * @return {object}            Object containing the comments
					 */

		            // scope.$meteorSubscribe('commentsByParent', scope.getReactively('parent'),
					// {
					// 	limit: scope.getReactively('perPage'),
		            //     skip: parseInt((scope.getReactively('page') - 1) * scope.getReactively('perPage')),
		            //     sort: { full_slug: scope.getReactively('sort') }
					// }
					// ).then( handle => {
					// 	scope.commentCount = $meteor.object(Counts, 'numberOfComments', false);
						// console.log(scope.commentCount.count);

						/**
						 * The commens collection
						 */
			            scope.comments = $meteor.collection(() => {
			                return Comments.find({ parent_id: scope.getReactively('parent') }, {
			                    sort: { full_slug: scope.getReactively('sort') }
			                });
			            });

						if (scope.loaded !== undefined) {
							scope.loaded = true;
							if (scope.loadingMore !== undefined) {
								scope.loadingMore = false;
							}
						}

		            // });

		        });

				scope.addMoreComments = function() {
					console.log('add more items');
				};


				scope.commentAuthor = function(comment) {
					var author = $meteor.object(Meteor.users, comment.author.id, false);
					return author;
				}


				scope.pageReady = true;

				scope.openComposer = function(post) {
			        var replyPost = {
			            reply: true,
			            parent: post
			        }

					scope.$root.composer.open(replyPost);
				};


				scope.replyTo = function(comment) {
					scope.reply({post: comment});
				};



				/**
				 * Change the collection sorting order
				 * @return {void 0}
				 */
		        scope.reSort = () => {
		            scope.sort = parseInt(scope.sort) === 1 ? -1 : 1;
		        };
		    });
		}
	};

}
CommentDirective.$inject = ['RecursionHelper', '$meteor', '$stateParams'];

angular.module('app').directive('comments', CommentDirective);
