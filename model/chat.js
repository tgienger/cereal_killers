Chat = new Mongo.Collection('chat');

Chat.allow({
	insert: function(userId, chat) {
		if (!Roles.userIsInRole(userId, ['admin', 'member'])) {
			return false;
		}
		
		return true;
	},
    update: function() {
		return false;
	},
	remove: function(userId, chat) {
		if (userId !== chat.owner || !Roles.userIsInRole(userId, ['admin']))
			return false;
		return true;
	}
});