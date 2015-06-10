Meteor.roles.allow({
	insert: function(userId, news) {
		if (!Roles.userIsInRole(userId, ['admin', 'rolesAdmin'])) {
			return false;
		}
		return true;
	},
	update: function(userId, news, fields, modifier) {
		if (!Roles.userIsInRole(userId, ['admin', 'rolesAdmin'])) {
			return false;
		}
		return true;
	},
	remove: function(userId, news) {
		if (!Roles.userIsInRole(userId, ['admin', 'rolesAdmin'])) {
			return false;
		}
		return true;
	}
});