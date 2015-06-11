Meteor.publish('news', function(options) {
	
	var all = Rules.findOne({name: 'news'}).rules.all;
	var private = Rules.findOne({name: 'news'}).rules.private;
	

	if (Roles.userIsInRole(this.userId, all)) {
		return News.find({});
	}
	
	
	if (Roles.userIsInRole(this.userId, private)) {
		
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