Rules = new Mongo.Collection('rules');

Rules.allow({
	insert: function(userId, rule) {
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
		
		return false;
	},
	update: function(userId, rule, fields, modifier) {
		
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
			
		return false;
	},
	remove: function(userId, rule) {
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
		
		return false;
	}
});