Meteor.publish('chat', function() {
	
	var rules = Rules.findOne({name: 'chat'});
	
	var view = rules.view;
	
	if (Roles.userIsInRole(this.userId, view)) {
		return Chat.find({}, {sort: {date: -1}, limit: 25});
	}
});