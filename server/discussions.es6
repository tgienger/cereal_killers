/// <reference path="../typings/underscore/underscore.d.ts"/>
/// <reference path="../typings/tsd.d.ts" />


Meteor.publish('discussions', function (options) {
	return Discussions.find({}, options);
});



class Children {
	constructor(parentId) {
		this.parent = parentId;
		this.query = Comments.find(
			{ parent_id: this.parent },
			{ limit: 5, sort: { date: -1 } }
			);
	}

	find() {
		return this.query;
	}
}



Meteor.publishComposite('oneDiscussion', function (slug, options) {

	var query = {};
	query.find = function () {
		return Discussions.find({ slug: slug }, { limit: 1 });
	};

	var mainChildQuery = Comments.find({ slug: slug }, { limit: 1 });

	query.children = [];
	query.children[0] = {};
	query.children[0].find = function (discussion) {
		return mainChildQuery;
	};
	query.children[0].children = [];
	query.children[0].children[0] = {};
	query.children[0].children[0].find = function (comment) {
		return Meteor.users.find({ _id: comment.author.id }, { limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } });
	};
	query.children[0].children[1] = {};
	query.children[0].children[1].find = function (parent) {
		return Comments.find({ parent_id: parent._id }, options);
	};
	query.children[0].children[2] = {
		find: function(parent) {
			Counts.publish(this, 'numberOfComments', Comments.find(
				{ parent_id: parent._id }
				), { noReady: true });
				
			return;
		}
	}

	//	var parentQuery = Comments.find({ slug: slug });
	var parent = mainChildQuery.fetch();
	var children = Comments.find({ parent_id: parent[0]._id }, { limit: 25 }).fetch();

	var childrenIds = _.pluck(children, '_id');


	var getChildren = function (children_ids, thisParent) {
//		var self = this;
//		self.parent = thisParent;
		var i = 0;
		thisParent.children = [];

		var recursive = function getEm(children, parent) {
			_.each(children, function (id) {
				
				//				parent.children[i] = new Children(id);
				var query = Comments.find({ parent_id: id }, { limit: 5, sort: { date: -1 } });
				parent.children[i] = {
					find: function () {
						return Comments.find({ parent_id: id }, { limit: 5, sort: { date: -1 } });
					}
				};


				var children1 = query.fetch();
				var newChildrenIds = _.pluck(children1, '_id');
				i++;
				if (newChildrenIds.length > 0) {
					getEm(newChildrenIds, parent);
				}
			});
		}

		recursive(children_ids, thisParent);

	};

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
