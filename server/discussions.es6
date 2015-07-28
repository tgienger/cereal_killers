/// <reference path="../typings/tsd.d.ts" />


Meteor.publish('discussions', function (options) {
	return Discussions.find({}, options);
});


Meteor.publishComposite('discussion', function (discussion_slug, options) {

	return {
		find: function () {
			return Discussions.find(
				{ slug: discussion_slug },
				{ limit: 1 });
		},
		children: [
			{
				find: function (discussion) {
					return Comments.find(
						{ slug: discussion.slug },
						{ limit: 1 });
				},
				children: [
					{
						find: function (comment) {
							return Meteor.users.find(
								{ _id: comment.author.id },
								{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } }
								);
						}
					},
					{
						find: function (parent) {

							Counts.publish(this, 'numberOfComments', Comments.find(
								{ parent_id: parent._id }
								), { noReady: true });

							return;
							// return Comments.find({parent_id: parent._id}, {limit: 25, sort: {posted: -1}});
						}
					}
				]
			},
			{
				find: function (discussion) {
					return Meteor.users.find(
						{ _id: discussion.author.id },
						{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } }
						);
				}
			}
		]
	}
});

Meteor.publishComposite('subDiscussion', function (discussion_slug, comment_slug, options) {

	return {
		find: function () {
			return Discussions.find(
				{ slug: discussion_slug },
				{ limit: 1 });
		},
		children: [
			{
				find: function (discussion) {
					return Comments.find(
						{ slug: comment_slug },
						{ limit: 1 });
				},
				children: [
					{
						find: function (comment) {
							return Meteor.users.find(
								{ _id: comment.author._id },
								{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } });
						}
					},
					{
						find: function (parent) {

							Counts.publish(this, 'numberOfComments', Comments.find(
								{ parent_id: parent._id }
								), { noReady: true });

							return;
						}
					}
				]
			},
			{
				find: function (discussion) {
					return Meteor.users.find(
						{ _id: discussion.author.id },
						{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } });
				}
			}
		]
	}
});