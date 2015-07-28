/// <reference path="../typings/tsd.d.ts" />

Meteor.publish('chat', function(started) {

	var rules = Rules.findOne({name: 'chat'});

	var view = rules.view;

	if (Roles.userIsInRole(this.userId, view)) {

		var query = Chat.find({date: {$gt: started}});

		return query;
	}
});

Meteor.publish('previousChat', function() {
	var view = Rules.findOne({name: 'chat'});
	
	if (Roles.userIsInRole(this.userId, view)) {
		var query = Chat.find({limit: 25, sort: {date: -1}});
		
		query.stop();
		
		return query;
	}
})

// Meteor.publish('newChat', function() {
//
// })
