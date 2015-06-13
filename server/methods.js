/* global Roles */
/* global Meteor */
Meteor.methods({
	
	// user is an admin
	isAdmin: function() {
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, ['admin'])) {
			throw new Meteor.Error(401, "AUTH_REQUIRED");
		}
		
		return true;
	},
	
//	create new roles
	createRole: function(role) {
		
		var all = Rules.findOne({name: 'roles'}).all;
		
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.createRole(role);
	},
	
	// delete role
	deleteRole: function(role) {
		
		var all = Rules.findOne({name: 'roles'}).all;
		
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.deleteRole(role);
	},
	
//	add user to role
	addUsersToRoles: function(targetUser, roles){
		
		var all = Rules.findOne({name: 'roles'}).all;
		
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.addUsersToRoles(targetUser, roles);
	},
	
//	remove user from roles
	removeUsersFromRoles: function(targetUserId, role) {
		
		var all = Rules.findOne({name: 'roles'}).all;
		
		var user = Meteor.user();
		
		
		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Roles.removeUsersFromRoles(targetUserId, role);
	}
});