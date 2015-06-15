/* global Mongo */
/* global News */
News = new Mongo.Collection('news');


News.allow({
	insert: function(userId, news) {
		
		var all = Rules.findOne({name: 'news'}).all;
		var insert = Rules.indOne({name: 'news'}).insert;
		
		var allowed = _.union(all, insert);
		
		if (Roles.userIsInRole(userId, allowed)) {
			return true;
		}
		
		return false;
	},
	update: function(userId, news, fields, modifier) {
		
		var all = Rules.findOne({name: 'news'}).all;
		
		if (Roles.userIsInRole(userId, all)) {
			return true;
		}
			
		return false;
	},
	remove: function(userId, news) {
		
		var all = Rules.findOne({name: 'news'}).all;
		
		if (!Roles.userIsInRole(userId, all))
			return false;
		return true;
	}
});