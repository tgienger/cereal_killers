Meteor.publish('chat', function() {
	
	var all = Rules.findOne({name: 'chat'}).rules.all;
	var private = Rules.findOne({name: 'chat'}).rules.private;
	
	var userChat = _.union(all, private);
	
	if (Roles.userIsInRole(this.userId, userChat)) {
		return Chat.find({}, {sort: {date: -1}, limit: 25});
	}
});