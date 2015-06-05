Meteor.publish('news', function(options) {
	if (Roles.userIsInRole(this.userId, ['admin'])) {
		return News.find({});
	}
	
	if (Roles.userIsInRole(this.userId, ['member'])) {
		return News.find({'visible': true});
	}
	
	return News.find({
		$or: [
			{$and: [
				{'private' : false},
				{'private' : {$exists: true}},
				{'visible' : true}
			]},
			{$and: [
				{owner: this.userId},
				{owner: {$exists: true}}
			]}
		]
	});
});