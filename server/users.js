Meteor.publish("users", function () {
  return Meteor.users.find({
    username: {$nin: ['webmaster']}
  }, {fields: {services: 0}});
});