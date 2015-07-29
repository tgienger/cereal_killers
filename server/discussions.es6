/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/tsd.d.ts" />


Meteor.publish('discussions', function (options) {
	return Discussions.find({}, options);
});

Meteor.publishComposite('oneDiscussion', function (slug) {


	function discussionQuery(slug) {
		return Discussions.find({ slug: slug }, { limit: 1 });
	}

	function mainComment(discussion) {
		return Comments.find({ slug: discussion.slug }, { limit: 1 });
	}

	function childComments(parent, limit) {
		return Comments.find({ parent_id: parent._id }, { limit: limit, sort: { date: -1 } })
	}

	function usersQuery(parent) {
		return Meteor.users.find({ _id: parent.author.id }, { limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } });
	}

	var query = {};
	query.find = function () {
		return discussionQuery(slug);
	}
	query.children = [];
	query.children[0] = {};
	query.children[0].find = function (discussion) {
		return Comments.find({ slug: discussion.slug }, { limit: 1 });
	}
	query.children[0].children = [];
	query.children[0].children[0] = {};
	query.children[0].children[0].find = function (comment) {
		return Meteor.users.find({ _id: comment.author.id }, { limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } });
	}
	query.children[0].children[1] = {};
	query.children[0].children[1].find = function (parent) {
		return Comments.find({ parent_id: parent._id }, { limit: 25, sort: { date: -1 } });
	}

	var parentQuery = Comments.find({slug: slug});
	var parent = parentQuery.fetch();
	var children = Comments.find({parent_id: parent[0]._id}, {limit: 25}).fetch();

	var childrenIds = _.pluck(children, '_id');


	function getChildren(children_ids, thisParent) {
		var self = this;

		// if (children_ids.length > 0) {
			// thisParent.children = [];
			// thisParent.children[0] = {};
			self.query = Comments.find({parent_id: {$in: children_ids}}, {limit: 5, sort: {date: -1}});
			// thisParent.children[0].find = function() {
			// 	return self.query;
			// }
			var subComments = self.query.fetch();
			var ids = _.pluck(subComments, '_id');
			// console.log(ids);
			// if (ids.length > 0) {
			// }
			_.each(ids, function(id) {
				console.log(id);
			});


			// var children = Comments.find({parent_id: parent._id})
		// }
	}

	getChildren(childrenIds, query.children[0].children[1]);

	return query;

});


Meteor.publishComposite('discussion', function (discussion_slug, options) {

	return {
		find: function () {
			return Discussions.find(
				{ slug: discussion_slug },
				{ limit: 1 }
				);
		},
		children: [
			{
				find: function (discussion) {
					return Comments.find(
						{ slug: discussion.slug },
						{ limit: 1 }
						);
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
