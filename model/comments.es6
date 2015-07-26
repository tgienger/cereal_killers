/* global Comments, Meteor, Rules, Roles */

Comments = new Meteor.Collection('comments');

Comments.allow({
	insert: (userId, comment) => {
		if (!userId || userId !== comment.author._id) {
			return false;
		}

		var allowed = Rules.findOne({name: 'comments'}).insert;
		if (!Roles.userIsInRole(userId, allowed)) {
			return false;
		}

		return true;
	},

	update: (userId, comment) => {
		if (!userId || userId !== comment.author._id) {
			return false;
		}

		var allowed = Rules.findOne({name: 'comments'}).update;
		if (!Roles.userIsInRole(userId, allowed)) {
			return false;
		}

		return true;
	},
	remove: (userId, comment) => {
		if (!userId || userId !== comment.author._id) {
			return false;
		}

		var allowed = Rules.findOne({name: 'comments'}).all;
		if (!Roles.userIsInRole(userId, allowed)) {
			return false;
		}

		return true;
	}
});
