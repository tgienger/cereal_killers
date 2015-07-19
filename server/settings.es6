Meteor.publish('sitesettings', function() {
	return SiteSettings.find({});
	var all = Rules.findOne({name: 'settings'}).all;
	
	if (Roles.userIsInRole(this.userId, all)) {
	    return SiteSettings.find({});
	}
});