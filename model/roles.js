Meteor.roles.allow({
	insert: function(userId, news) {
		
		var all = Rules.findOne({name: 'roles'}).rules.all;
		
		if (!Roles.userIsInRole(userId, all)) {
			return false;
		}
		return true;
	},
	update: function(userId, news, fields, modifier) {
		
		var all = Rules.findOne({name: 'roles'}).rules.all;
		
		if (!Roles.userIsInRole(userId, all)) {
			return false;
		}
		return true;
	},
	remove: function(userId, news) {
		
		var all = Rules.findOne({name: 'roles'}).rules.all;
		
		if (!Roles.userIsInRole(userId, all)) {
			return false;
		}
		return true;
	}
});