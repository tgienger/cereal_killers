/// <reference path="../typings/tsd.d.ts" />

Meteor.publish('chat', function(started) {

	var rules = Rules.findOne({name: 'chat'});

	var view = rules.view;

	if (Roles.userIsInRole(this.userId, view)) {

		var query = Chat.find({date: {$gt: started}});

		return query;
	}
});

// Meteor.publish('newChat', function() {
//
// })
