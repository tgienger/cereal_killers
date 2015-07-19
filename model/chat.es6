/* global Chat, Mongo, Rules, Roles */
Chat = new Mongo.Collection('chat');

Chat.allow({
	insert: function(userId, chat) {
		
		var rules = Rules.findOne({name: 'chat'});
		
		if (Roles.userIsInRole(userId, rules.all)) {
			return true;
		}
		
		if (Roles.userIsInRole(userId, rules.insert)) {
			return true;
		}
	},
    update: function(userId, chat) {
		
		var rules = Rules.findOne({name: 'chat'});
		
		if (Roles.userIsInRole(userId, rules.all)) {
			return true;
		}
		
		if (userId === chat.userId) {
			return true;
		}
		return false;
	},
	remove: function(userId, chat) {
		
		var rules = Rules.findOne({name: 'chat'}).rules;
		
		if (Roles.userIsInRole(userId, rules.all))
			return true;
			
		return false;
	}
});