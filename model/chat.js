Chat = new Mongo.Collection('chat');

Chat.allow({
	insert: function(userId, chat) {
		
		var rules = Rules.findOne({name: 'chat'});
		
		// if (Roles.userIsInRole(userId, rules.all)) {
		// 	return true;
		// }
		
		// if (Roles.userIsInRole(userId, rules.insert)) {
		// 	return true;
		// }
		return Roles.userIsInRole(userId, rules.all), Roles.userIsInRole(userId, rules.insert);
	},
    update: function() {
		return false;
	},
	remove: function(userId, chat) {
		
		var rules = Rules.findOne({name: 'chat'}).rules;
		
		if (Roles.userIsInRole(userId, rules.all))
			return true;
		return false;
	}
});