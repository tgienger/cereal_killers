Meteor.publish('mail', function(options) {
	
	return Mail.find({
		$and: [
			{recipient: this.userId},
			{recipient: {$exists: true}}
		]
	});
	
});