Meteor.publish('news', function(options) {

	var newsRules = Rules.findOne({name: 'news'});
	var all = newsRules.all;
	var view = newsRules.view;


	Counts.publish(this, 'newsCount', News.find({
		'visible': true
	}), {noReady: true});


	if (Roles.userIsInRole(this.userId, all)) {
		return News.find({});
	}


	if (Roles.userIsInRole(this.userId, view)) {
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
