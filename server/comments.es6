Meteor.publish('comments', function(options, options2) {
	// Counts.publish(this, 'numberOfComments', Comments.find({parent_id: 'nHrBSb4PRjRtp4W25'}, {noReady: true}));
	return Comments.find(options, options2);
});

Meteor.publish('mainComment', function(slug) {
	check(slug, String);

	return Comments.find({slug: slug});
});

Meteor.publishComposite('commentsByParent', function(parent_id, options) {
	return {
		find: function() {
			return Comments.find({parent_id: parent_id}, options);
		},
		children: [
			{
				find: function(comment) {
					return Meteor.users.find(
						{ _id: comment.author.id },
						{ limit: 1, fields: { profile: 1, roles: 1, createdAt: 1, username: 1 } }
					);
				}
			}
		]
	}
});
