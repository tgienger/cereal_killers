/* global News, Mongo, _, Rules */

News = new Mongo.Collection('news');


News.allow({
	insert: (userId, news) => {
		
		var all = Rules.findOne({name: 'news'}).all;
		var insert = Rules.findOne({name: 'news'}).insert;
		
		var allowed = _.union(all, insert);
		
		if (Roles.userIsInRole(userId, allowed)) {
			return true;
		}
		
		return false;
	},
	update: (userId, news, fields, modifier) => {
		
		var all = Rules.findOne({name: 'news'}).all;
		
		if (Roles.userIsInRole(userId, all)) {
			return true;
		}
			
		return false;
	},
	remove: (userId, news) => {
		
		var all = Rules.findOne({name: 'news'}).all;
		
		if (Roles.userIsInRole(userId, all))
			return true;
		return false;
	}
});