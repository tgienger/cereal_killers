class ChatController {

    static $inject = ['$scope', '$meteor', '$timeout', '$rootScope'];
    constructor($scope, $meteor, $timeout, $rootScope) {
        $scope.$meteorSubscribe('chat');
        this.messages = $meteor.collection(function() {
            return Chat.find({});
        });
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
    }

    scrollDiv(id) {
        var div = document.getElementById(id);
        div.scrollTop = div.scrollHeight;
    }

    replyTo(post) {
        var input = document.getElementById('chatInput');
        input.value += '@' + post.username + ' ';
        input.focus();
    }

    sendChat(msg) {
        if (!this.message || this.message === '') {
            return;
        }

        if (this.message.length > 150) {
            return;
        }

        var newChat = {
            username: this.$rootScope.currentUser.username,
            message: msg
        };

        this.messages.save(newChat);
        this.message = '';
        this.$timeout(() => {
            this.scrollDiv('chat_stream');
        });
    }
}
angular.module('app').controller('ChatController', ChatController);
