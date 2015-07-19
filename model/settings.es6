/* gobal SiteSettings, Mongo */

SiteSettings = new Mongo.Collection('sitesettings');


SiteSettings.allow({
	insert: (userId, news) => {
		
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
		
		return false;
	},
	update: (userId, news, fields, modifier) => {
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
		
		return false;
	},
	remove: (userId, news) => {
		if (Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
		
		return false;
	}
});