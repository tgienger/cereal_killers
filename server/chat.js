Meteor.publish('chat', function() {
	
	var rules = Rules.findOne({name: 'chat'});
	
	var all = rules.all;
	var view = rules.view;
	
	var userChat = _.union(all, view);
	
	if (Roles.userIsInRole(this.userId, userChat)) {
		return Chat.find({}, {sort: {date: -1}, limit: 25});
	}
});