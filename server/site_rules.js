Meteor.publish('rules', function() {
	if (Roles.userIsInRole(this.userId, ['admin'])) {
	    return Rules.find({});
	}
});