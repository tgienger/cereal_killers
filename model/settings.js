/* global Mongo */
/* global News */
SiteSettings = new Mongo.Collection('sitesettings');


SiteSettings.allow({
	insert: function(userId, news) {
		if (!Roles.userIsInRole(userId, ['admin'])) {
			return false;
		}
		return true;
	},
	update: function(userId, news, fields, modifier) {
		if (!Roles.userIsInRole(userId, ['admin'])) {
			return false;
		}
		return true;
	},
	remove: function(userId, news) {
		if (!Roles.userIsInRole(userId, ['admin'])) {
			return false;
		}
		return true;
	}
});