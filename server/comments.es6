Meteor.publish('comments', function(options) {
	return Comments.find({}, options);
});
