/* global Meteor */
Meteor.methods({
	isAdmin: function() {
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin'])) {
			throw new Meteor.Error(401, "AUTH_REQUIRED");
		}
		
		return true;
	}
});