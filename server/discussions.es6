Meteor.publish('discussions', function(options) {
	return Discussions.find({}, options);
});

Meteor.publish('oneDiscussion', function(slug) {

	var cursors = [];
	var tick = 0;

	var getChildComment = function() {
		var comment = Comments.find(
			{ slug: slug },
			{ limit: 1 }
		);
		cursors.push(comment);
	};

	var getAllChildren = function(parent, options) {
		console.log(parent._id);
		var comments =  Comments.find(
			{ parent_id: parent._id },
			options
		);
		cursors.push(comments);
		comments.forEach(function(comment) {
			getAllChildren(comment, {limit: 5, sort: {posted: -1}})
		});
	};

	var discussion = Discussions.find({slug: slug}, {limit: 1})

	cursors.push(discussion);

	var mainComment = Comments.find({slug: slug}, {limit: 1});

	cursors.push(mainComment);

	getAllChildren(mainComment, {limit: 25, sort: {posted: -1}});

	// return an array of cursors
	return cursors;
});


Meteor.publishComposite('discussion', function (discussion_slug, options) {
	return {
		find: function() {
			return Discussions.find(
				{ slug: discussion_slug },
				{ limit: 1 }
			);
		},
		children: [
			{
				find: function(discussion) {
					return Comments.find(
						{ slug: discussion.slug },
						{ limit: 1 }
					);
				},
				children: [
					{
						find: function(comment) {
							return Meteor.users.find(
								{ _id: comment.author.id },
								{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } }
							);
						}
					},
					{
						find: function(parent) {

							Counts.publish(this, 'numberOfComments', Comments.find(
								{parent_id: parent._id}
							), {noReady: true});

							return ;
							// return Comments.find({parent_id: parent._id}, {limit: 25, sort: {posted: -1}});
						}
					}
				]
			}
		]
	}
});
