/* global Meteor, Rules */

Meteor.roles.allow({
	insert: (userId, news) => {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (Roles.userIsInRole(userId, rules.all)) {
			return true;
		}
		return false;
	},
	update: (userId, news, fields, modifier) => {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (Roles.userIsInRole(userId, rules.all)) {
			return true;
		}
		return false;
	},
	remove: (userId, news) => {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (Roles.userIsInRole(userId, rules.all)) {
			return true;
		}
		return false;
	}
});