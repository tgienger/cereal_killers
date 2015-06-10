Meteor.publish("users", function () {
	if (Roles.userIsInRole(this.userId, ['admin', 'userAdmin'])) {
    return Meteor.users.find({
      username: {$nin: ['webmaster']}
    }, {fields: {services: 0}});
	} else {
    return Meteor.users.find({
      username: {$nin: ['webmaster']}
    }, {fields: {username: 1}});
  }
});