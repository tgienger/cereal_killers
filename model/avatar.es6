
Avatar = new Meteor.Collection('avatar');

Avatar.allow({
	insert: function (userId, avatar) {
        if (!userId || userId !== avatar.userId)
            return false;

        var allowed = Rules.findOne({name: 'avatar'}).insert;

        if (!Roles.userIsInRole(userId, allowed))
            return false;

        return true;
	},
	update: function (userId, mail) {
        if (!userId || userId !== avatar.userId)
            return false;

        var allowed = Rules.findOne({name: 'avatar'}).update;

        if (!Roles.userIsInRole(userId, allowed))
            return false;

        return true;
	},
	remove: function (userId) {
        if (!userId || userId !== avatar.userId)
            return false;

        var allowed = Rules.findOne({name: 'avatar'}).remove;

        if (!Roles.userIsInRole(userId, allowed))
            return false;

        return true;
	}
});
