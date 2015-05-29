Meteor.publish('news', function(options) {
	return News.find({visible: true}, options);
});