
function CommentHeaderDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'client/comment.directive/comment-header.ng.html',
        scope: {discussion: '=', comment: '='},
        link: function(scope, elem, attrs) {
        }
    }
}

CommentHeaderDirective.$inject = [];

angular.module('app').directive('commentHeader', CommentHeaderDirective);
