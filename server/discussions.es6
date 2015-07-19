Meteor.publish('discussions', function(options) {
	return Discussions.find({}, options);
});
