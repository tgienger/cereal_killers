/* global Mongo */
/* global News */
News = new Mongo.Collection('news');


News.allow({
	insert: function(userId, news) {
		return userId && news.owner === userId;
	},
	update: function(userId, news, fields, modifier) {
		
		if (userId === news.owner || Roles.userIsInRole(userId, ['admin'])) {
			return true;
		}
			
		return false;
	},
	remove: function(userId, news) {
		if (!Roles.userIsInRole(userId, ['admin']))
			return false;
		return true;
	}
});