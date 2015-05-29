/* global Roles */
/* global Meteor */
Meteor.methods({
	isAdmin: function() {
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin'])) {
			throw new Meteor.Error(401, "AUTH_REQUIRED");
		}
		
		return true;
	},
	
//	create new roles
	createRole: function(role) {
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin','rolesAdmin'])) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.createRole(role);
	},
	
//	add user to role
	addUsersToRoles: function(targetUser, roles){
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin', 'userAdmin'])) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.addUsersToRoles(targetUser, roles);
	},
	
//	remove user from roles
	removeUsersFromRole: function(targetUser, role) {
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin', 'userAdmin'])) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.removeUsersFromRoles(targetUser, roles);
	}
});