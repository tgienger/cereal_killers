/* global Roles */
/* global Meteor */
Meteor.methods({
	
	updateUserProfile: function(user) {
		
		var User = Meteor.user();
		var all = Rules.findOne({name: 'users'}).all;
		
		if (User._id === user._id) {
			Meteor.users.update({_id: user._id}, {$set: {profile: user.profile}});
		}
	},
	
	// user is an admin
	isAdmin: function() {
		var user = Meteor.user();
		var all = Rules.findOne({name: 'roles'}).all;
		
		if (!user || !Roles.userIsInRole(user, all)) {
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
	},
	
	
	// edit existing roles - propagate throughout user documents
	editRole: function(oldName, newName) {
		if (oldName === 'admin') {
			throw new Meteor.Error(403, 'ADMIN CANNOT BE CHANGED');
		}
		
		if (oldName === newName) {
			throw new Meteor.Error(403, 'NO CHANGE');
		}
		
		var all = Rules.findOne({name: 'roles'}).all;
		var user = Meteor.user();
		
		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}
		
		Meteor.users.update({roles: oldName}, {$set: {'roles.$': newName}}, {multi:true}, function() {
			Meteor.roles.update({name: oldName}, {$set: {name: newName}}, {multi:true});
		});
		
		// var rules = Rules.find({}).fetch();
		
		// console.log(rules);
		
		// _.each(rules, function(rule) {
		// 	_.each(rule, function(r) {
		// 		if (Object.prototype.toString.call(r) === '[object Array]') {
		// 			var index = _.indexOf(r, oldName);
		// 			Rules.update({rule: {$set: {r: newName}}});
		// 		}
		// 	});
		// });
		
	}
});