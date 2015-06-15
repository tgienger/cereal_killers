Meteor.publish('rules', function() {
	var all = Rules.findOne({name: 'roles'}).all;
	if (Roles.userIsInRole(this.userId, all)) {
	    return Rules.find({});
	}
});