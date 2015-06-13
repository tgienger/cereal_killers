Meteor.publish("users", function () {
  
  var all = Rules.findOne({name: 'users'}).all;
  
	if (Roles.userIsInRole(this.userId, all)) {
    return Meteor.users.find({
      username: {$nin: ['webmaster']}
    }, {fields: {services: 0}});
	} else {
    return Meteor.users.find({
      username: {$nin: ['webmaster']}
    }, {fields: {username: 1}});
  }
});