Meteor.publish('chat', function() {
	if (Roles.userIsInRole(this.userId, ['admin', 'member'])) {
		return Chat.find({}, {sort: {date: -1}, limit: 25});
	}
});