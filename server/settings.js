Meteor.publish('sitesettings', function() {
	if (Roles.userIsInRole(this.userId, ['admin'])) {
	    return SiteSettings.find({});
	}
});