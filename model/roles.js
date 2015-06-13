Meteor.roles.allow({
	insert: function(userId, news) {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (!Roles.userIsInRole(userId, rules.all)) {
			return false;
		}
		return true;
	},
	update: function(userId, news, fields, modifier) {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (!Roles.userIsInRole(userId, rules.all)) {
			return false;
		}
		return true;
	},
	remove: function(userId, news) {
		
		var rules = Rules.findOne({name: 'roles'});
		
		if (!Roles.userIsInRole(userId, rules.all)) {
			return false;
		}
		return true;
	}
});