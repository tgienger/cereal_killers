/* global Mail, Meteor, Rules */
Mail = new Meteor.Collection('mail');

Mail.allow({
	insert: (userId, mail) => {
		if (!userId || userId !== mail.sender._id)
			return false;

		var allowed = Rules.findOne({name: 'mail'}).insert;

		if (!Roles.userIsInRole(userId, allowed)) {
			return false;
		}

		return true;

	},
	update: (userId, mail) => {

		var allowed = Rules.findOne({name: 'mail'}).all;

		if (!Roles.userIsInRole(userId, allowed))
			return false;

		return true;

	},
	remove: (userId) => {

		var allowed = Rules.findOne({name: 'mail'}).remove;

		if (!Roles.userIsInRole(userId, allowed))
			return false;

		return true;

	}
});
