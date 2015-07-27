Meteor.startup(function() {
	var adminId;

	if (Meteor.roles.find().count() === 0) {
		Roles.createRole('admin');
		Roles.createRole('super moderator');
		Roles.createRole('moderator');
		Roles.createRole('member');
		Roles.createRole('registered');
	}

	if (SiteSettings.find().count() === 0) {
		SiteSettings.insert({
			news: {
				'visible': true,
				'private': false
			},
			users: {
				'roleConfirm': true
			}
		});
	}

	if (Meteor.users.find().count() === 0) {
		adminId = Accounts.createUser({
			username: 'Admin',
			email: 'admin@ck-gaming.com',
			password: '@dminP@ssw0rd',
			profile: {firstName: 'Admin',
			lastName: 'SuperUser',
			bio: 'I\'m the admin, yo'}
		});
		// Lets create the admin role so we can
		// add these users to it.
		Roles.addUsersToRoles(adminId, ['admin']);
	}

	if (Meteor.users.find({username: 'webmaster'}).count() === 0) {
		adminId = Accounts.createUser({
			username: 'webmaster',
			email: 'kilrain@gmail.com',
			password: 'Elkmeat1',
			profile: {firstName: 'Tj',
				lastName: 'Gienger',
				bio: 'ck-gmaing.com webmaster'}
		});

		Roles.addUsersToRoles(adminId, ['admin']);
	}

	if (SiteSettings.find().count() === 0) {
		SiteSettings.insert({'news': {
			'visible': true,
			'private': false
		}});
	}

	if (Rules.find().count() === 0) {
		Rules.insert({
			name: 'news',
			all: ['admin', 'super moderator'],
			view: ['admin', 'super moderator', 'member'],
			insert: ['admin', 'super moderator'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator']
		});
		Rules.insert({
			name: 'roles',
			all: ['admin', 'super moderator'],
			view: ['admin', 'super moderator', 'member'],
			insert: ['admin', 'super moderator'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator']
		});
		Rules.insert({
			name: 'chat',
			all: ['admin', 'super moderator'],
			view: ['admin', 'super moderator', 'member'],
			insert: ['admin', 'super moderator'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator']
		});
		Rules.insert({
			name: 'settings',
			all: ['admin', 'super moderator'],
			view: ['admin', 'super moderator'],
			insert: ['admin', 'super moderator'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator']
		});
		Rules.insert({
			name: 'users',
			all: ['admin'],
			view: ['admin', 'super moderator', 'member'],
			insert: ['admin', 'super moderator'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator']
		});
		Rules.insert({
			name: 'mail',
			all: ['admin', 'super moderator'],
			view: ['admin', 'member', 'registered'],
			insert: ['admin', 'member', 'registered'],
			update: ['admin', 'super moderator'],
			remove: ['admin', 'super moderator', 'registered']

		});
	}

	if (Discussions.find().count() === 0) {


		/**
		 * Reformats strings to be URL friendly
		 * @param: {string} str
		 * @returns: {string} str
		 */
		function string_to_slug(str)
		{
		  str = str.replace(/^\s+|\s+$/g, ''); // trim
		  str = str.toLowerCase();

		  // remove accents, swap ñ for n, etc
		  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
		  var to   = "aaaaeeeeiiiioooouuuunc------";
		  for (var i=0, l=from.length ; i<l ; i++) {
		    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		  }

		  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		    .replace(/\s+/g, '-') // collapse whitespace and replace by -
		    .replace(/-+/g, '-'); // collapse dashes

		  return str;
		}


		/**
		 * Generates random slug (number between 1 and 999)
		 * @returns: {number}
		 */
		function randomSlug()
		{
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}


		// Start of Discussion

		var title = 'This is my 1st discussion';
		var dPosted = new Date();
		var slug = randomSlug() + '-' + string_to_slug(title);
		var text = 'this is the first post in my threaded forum';
		var dAuthor = {id: 'kTz6uBSNjd8tqeFm6', name: 'Admin'};

		// // insert the new discussion
		// // this is the discussion/title that would be displayed
		// // in the main forum or sub forum section.
		var discussionId = Discussions.insert({
			parent_id: '',
			slug: slug,
			full_slug: moment(dPosted).format() + '-' + slug,
			posted: dPosted,
			author: dAuthor,
			text: title
		});
		// this is the main comment created when the discussion
		// is started. to be seen when the discussion is opened.
		var commentId = Comments.insert({
			discussion_id: discussionId,
			parent_id: discussionId,
			slug: slug,
			full_slug: slug,
			posted: dPosted,
			author: dAuthor,
			text: text
		});
		// end main discussion


		// FIST COMMENT
		// I'm going to create the first comment in the forum
		// This will be a reply to the first comment.
		var commentPosted = new Date();
		var commentSlugPart = randomSlug();
		var commentFullSlugPart = moment(commentPosted).format() + '-' + commentSlugPart;
		var commentText = "This is a reply to the main post.";

		// if there is a parent
		// otherwise use commentSlugPart && commentFullSlugPart
		// for the slug and full_slug.
		var parent = Comments.findOne(
			{discussion_id: discussionId, slug: slug});
		var commentSlug = parent.slug + '-' + commentSlugPart;
		var commentFullSlug = parent.full_slug + '-' + commentFullSlugPart;

		var firstReply = Comments.insert({
			discussion_id: discussionId,
			parent_id: commentId,
			slug: commentSlug,
			full_slug: commentFullSlug,
			posted: commentPosted,
			author: dAuthor,
			text: commentText,
			visible: true
		});


		// SECOND COMMENT
		// One more reply to the first comment (main discussion)
		var commentPosted2 = new Date();
		var commentSlugPart2 = randomSlug();
		var commentFullSlugPart2 = moment(commentPosted2).format() + '-' + commentSlugPart2;
		var commentText2 = "This is the second reply to the main post.";

		// if there is a parent
		// otherwise use commentSlugPart && commentFullSlugPart
		// for the slug and full_slug
		var parent2 = Comments.findOne(
			{discussion_id: discussionId, slug: slug});
		var commentSlug2 = parent2.slug + '-' + commentSlugPart;
		var commentFullSlug2 = parent2.full_slug + '-' + commentFullSlugPart2;

		var secondReply = Comments.insert({
			discussion_id: discussionId,
			parent_id: commentId,
			slug: commentSlug2,
			full_slug: commentFullSlug2,
			posted: commentPosted2,
			author: dAuthor,
			text: commentText2,
			visible: true
		});


		// REPLY TO FRIST COMMENT
		// Now I would like a threaded reply to the first comment
		var threadedPosted = new Date();
		var threadedSlugPart = randomSlug();
		var threadedFullSlugPart = moment(threadedPosted).format() + '-' + threadedSlugPart;
		var threadedText = "this is a reply to the first comment";

		// Another "if(parent)" deal here
		var threadParent = Comments.findOne(
			{discussion_id: discussionId, slug: commentSlug});
		var threadSlug = threadParent.slug + '-' + threadedSlugPart;
		var threadFullSlug = threadParent.full_slug + '-' + threadedFullSlugPart;

		var firstThreaded = Comments.insert({
			discussion_id: discussionId,
			parent_id: firstReply,
			slug: threadSlug,
			full_slug: threadFullSlug,
			posted: threadedPosted,
			author: dAuthor,
			text: threadedText,
			visible: true
		});

		/*
		what it should look like
		_________________________

		title: this is my 1st discussion
		body: this is the first post in my threaded forum.

			comment: This is a reply to the main post.
				threadedComment: this is a reply to the first comment

			comment2: This is the second reply to the main post.

		_________________________
		*/

	}
});
