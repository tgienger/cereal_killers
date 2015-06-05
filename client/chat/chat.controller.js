angular.module('app').controller('ChatController', [
	'$scope',
	'$meteor',
	'$timeout',
	function($scope, $meteor, $timeout) {
		
		
		
		var scrollDiv= function(id) {
			var div = document.getElementById(id);
			div.scrollTop = div.scrollHeight;
		};
		

		
		$meteor.autorun($scope, function() {
			$scope.$meteorSubscribe('chat').then(function(handle) {
				var chatHandle = handle;
			});
			
			$scope.chatMessages = $meteor.collection(function() {
				return Chat.find({});
			});
			
		});
		
		
		
		
		$timeout(function() {
			scrollDiv('chat_stream');
		}, 500);
		
		
		$scope.replyTo = function(post) {
			var input = document.getElementById('chatInput');
			
//			TODO: add hovering of username to show original message.
			input.value += '@' + post.username + ' ';
			input.focus();
		};
		
		
		$scope.sendChat = function(chat) {
			
			if (!chat.message || chat.message === '')
				return;
				
			if (chat.message.length > 150)
				return;
				
			$scope.chatMessages.save(chat);
			
			this.chat.message = '';
			
			$timeout(function() {
				scrollDiv('chat_stream');
			});
		};
		
		
		$scope.$watchCollection('chatMessages', function(n, o) {
			var div = document.getElementById('chat_stream');
			if (div.scrollTop !== div.scrollHeight) {
				return;
			}
			scrollDiv('chat_stream');
		});
	}
]);