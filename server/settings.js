Meteor.publish('sitesettings', function() {
	var all = Rules.findOne({name: 'settings'}).all;
	if (Roles.userIsInRole(this.userId, all)) {
	    return SiteSettings.find({});
	}
});