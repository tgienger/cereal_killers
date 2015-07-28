
const ROOTSCOPE = new WeakMap();
const TIMEOUT = new WeakMap();
const METEOR = new WeakMap();

class ChatController {

    static $inject = ['$scope', '$meteor', '$timeout', '$rootScope'];
    constructor($scope, $meteor, $timeout, $rootScope) {

        this.chatTimer;
        this.waitTime = 3000;
        
        $meteor.autorun($scope, () => {
             $scope.$meteorSubscribe('chat', Session.get('chatTimeStart')).then(() => {

                 var query = Chat.find();

                 this.messages = $meteor.collection(function() {
                     return query;
                 });
                 
                //  initializing = false;
                 $timeout(() => {
                     this.scrollDiv('chat_stream');
                 });
             });
        });


        ROOTSCOPE.set(this, $rootScope);
        TIMEOUT.set(this, $timeout);
        METEOR.set(this, $meteor);
    }


    /**
     * Scrolls a given div to bottom by id
     * @param  {String} id the id of the div you wish to scroll
     * @return {void 0}
     */
    scrollDiv(id) {
        var div = document.getElementById(id);
        div.scrollTop = div.scrollHeight;
    }


    /**
     * Places the username of the person replyingn to into chat input
     * @param  {Object} post the post object you're replying to
     * @return {void 0}
     */
    replyTo(post) {
        var input = document.getElementById('chatInput');
        input.value += '@' + post.username + ' ';
        input.focus();
    }

    /**
     * Sends Message to Chat Room
     * @param  {String} msg The messsage the user is sending
     * @return {void 0}
     */
    sendChat(msg) {

        if (!this.message || this.message === '') {
            return;
        }

        if (this.message.length > 150) {
            return;
        }

        var newChat = {
            username: ROOTSCOPE.get(this).currentUser.username,
            date: moment().format(),
            message: msg
        };

        if (this.chatTimer + this.waitTime > this.now()) {
            return;
        }

        this.messages.save(newChat);
        this.message = '';
        this.chatTimer = this.now();

        TIMEOUT.get(this)(() => {
            this.scrollDiv('chat_stream');
        });
    }

    /**
     * Returns Unix Timestamp (in miliseconds)
     * @return {Void 0}
     */
    now() {
        return moment().unix() * 1000;
    }
}
angular.module('app').controller('ChatController', ChatController);
