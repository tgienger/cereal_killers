function ChatDirective($timeout) {
    return {
        restrict: 'E',
        controllerAs: 'chat',
        controller: 'ChatController',
        templateUrl: 'client/chat/chat.controller.ng.html',
        link: function (scope, elem, attrs, chat) {

            $timeout(function () {
                chat.scrollDiv('chat_stream');
            }, 1000);
            scope.$watchCollection('chatMessages', function (n, o) {
                var div = document.getElementById('chat_stream');
                if (div.scrollTop !== div.scrollHeight) {
                    return;
                }
                chat.scrollDiv('chat_stream');
            });
        }
    };
}
ChatDirective.$inject = ['$timeout'];
angular.module('app').directive('chatPanel', ChatDirective);
