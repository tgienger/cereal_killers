/// <reference path="../typings/tsd.d.ts" />

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
 * Generates random slug (number/chars between 1 and 999 a-zA-Z)
 * @returns: {string}
 */
function randomSlug()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}



Meteor.methods({

	updateUserProfile: function(user) {

		var User = Meteor.user();
		var all = Rules.findOne({name: 'users'}).all;

		if (User._id === user._id) {
			Meteor.users.update({_id: user._id}, {$set: {profile: user.profile}});
		}
	},

	// user is an admin
	isAdmin: function() {
		var user = Meteor.user();
		var all = Rules.findOne({name: 'roles'}).all;

		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, "AUTH_REQUIRED");
		}

		return true;
	},

//	create new roles
	createRole: function(role) {

		var all = Rules.findOne({name: 'roles'}).all;

		var user = Meteor.user();

		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}

		Roles.createRole(role);
	},

	// delete role
	deleteRole: function(role) {

		var all = Rules.findOne({name: 'roles'}).all;

		var user = Meteor.user();

		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}

		Roles.deleteRole(role);
	},

//	add user to role
	addUsersToRoles: function(targetUser, roles) {

		var all = Rules.findOne({name: 'roles'}).all;

		var user = Meteor.user();

		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}

		Roles.addUsersToRoles(targetUser, roles);
	},

//	remove user from roles
	removeUsersFromRoles: function(targetUserId, role) {

		var all = Rules.findOne({name: 'roles'}).all;

		var user = Meteor.user();


		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}

		Roles.removeUsersFromRoles(targetUserId, role);
	},


	// edit existing roles - propagate throughout user documents
	editRole: function(oldName, newName) {
		if (oldName === 'admin') {
			throw new Meteor.Error(403, 'ADMIN CANNOT BE CHANGED');
		}

		if (oldName === newName) {
			throw new Meteor.Error(403, 'NO CHANGE');
		}

		var all = Rules.findOne({name: 'roles'}).all;
		var user = Meteor.user();

		if (!user || !Roles.userIsInRole(user, all)) {
			throw new Meteor.Error(401, 'AUTH_REQUIRED');
		}

		Meteor.users.update({roles: oldName}, {$set: {'roles.$': newName}}, {multi:true}, () => {
			Meteor.roles.update({name: oldName}, {$set: {name: newName}}, {multi:true});
		});

		// var rules = Rules.find({}).fetch();

		// console.log(rules);

		// _.each(rules, function(rule) {
		// 	_.each(rule, function(r) {
		// 		if (Object.prototype.toString.call(r) === '[object Array]') {
		// 			var index = _.indexOf(r, oldName);
		// 			Rules.update({rule: {$set: {r: newName}}});
		// 		}
		// 	});
		// });

	},

	/**
	 * Save Discussion Method
	 * save the discussion into the discussions collection
	 */
	saveDiscussion: function(discussion) {

		// get the currently logged in user for later use on insertion.
		// if not, throw an error
		var user = Meteor.user();
		if (!user) {
			throw new Meteor.Error(401, "Not Authorized", "Must be logged in");
		}
		var dAuthor = {id: user._id, name: user.username};

		// Check if there is even a discussion sent to insert
		if (!discussion) {
			throw new Meteor.Error(404, "Not Found", "No Discussion Found");
		}

		// Throw error if there is no subject attached to this discussion
		if (!discussion.subject || discussion.subject.length < 1) {
			throw new Meteor.Error(404, "No Subject Found", "Every discussion must have a subject");
		}
		var title = sanitizeHtml(discussion.subject, {
			allowedTags: [ 'b', 'i', 'strong', 'em' ]
		});

		// throw an error if there is no markdown (body) for this discussion
		if (!discussion.markdown || discussion.markdown.lenght < 1) {
			throw new Meteor.Error(404, "No Text Found", "There is no body to this discussion");
		}

		var text = sanitizeHtml(discussion.markdown, {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
		});

		var dPosted = new Date();
		var slug = randomSlug() + '-' + string_to_slug(title);
		var full_slug = moment(dPosted).format() + '-' + slug;

		/**
		 * We insert the new discussion here
		 */
		var discussionId = Discussions.insert({
			parent_id: '',
			slug: slug,
			full_slug: full_slug,
			posted: dPosted,
			author: dAuthor,
			text: title
		});

		/**
		 * This is the comment part of the new discussion.
		 * We're giving it the same slug and flull slug as they are a pair.
		 */
		var commentId = Comments.insert({
			discussion_id: discussionId,
			parent_id: discussionId,
			slug: slug,
			full_slug: full_slug,
			posted: dPosted,
			author: dAuthor,
			text: text
		});




	},
	
	/**
	 * Remove Discussion
	 * Removes this discussion from the discussions collection
	 */
	removeDiscussion: function(discussion) {
		
		var user = Meteor.user();
		
		var rules = Rules.findOne({name: 'forums'});
		
		var allowRemove = _.union(rules.all, rules.remove);
		
		if (!user || !Roles.userIsInRole(user, allowRemove)) {
			throw new Meteor.Error(401, "Not Authorized");
		}
		
		Discussions.remove({_id: discussion._id});
		
	},
	
	/**
	 * Save Comment
	 * Saves this comment into the comments collection
	 */
	saveComment: function(comment) {

        // get the currently logged in user for later use on insertion.
        // if not, throw an error
        var user = Meteor.user();
        if (!user) {
            throw new Meteor.Error(401, "Not Authorized", "Must be logged in");
        }
        var dAuthor = {id: user._id, name: user.username};

		// Check if there is even a discussion sent to insert
		if (!comment) {
			throw new Meteor.Error(404, "Not Found", "No Comment Found");
		}

		// throw an error if there is no markdown (body) for this discussion
		if (!comment.markdown || comment.markdown.lenght < 1) {
			throw new Meteor.Error(404, "No Text Found", "There is no body to this comment");
		}

		var commentText = sanitizeHtml(comment.markdown, {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
		});

		// FIST COMMENT
		// I'm going to create the first comment in the forum
		// This will be a reply to the first comment.
		var commentPosted = new Date();
		var commentSlugPart = randomSlug();
		var commentFullSlugPart = moment(commentPosted).format() + '/' + commentSlugPart;

		// if there is a parent
		// otherwise use commentSlugPart && commentFullSlugPart
		// for the slug and full_slug.
		var parent = Comments.findOne(
			{_id: comment.reply_id});

		var commentSlug = parent.slug + '/' + commentSlugPart;
		var commentFullSlug = parent.full_slug + '/' + commentFullSlugPart;

		Comments.insert({
			discussion_id: parent.discussion_id,
			parent_id: parent._id,
			slug: commentSlug,
			full_slug: commentFullSlug,
			posted: commentPosted,
			author: dAuthor,
			text: commentText,
			visible: true
		});

	}
	//
	// addVpnUser: function(username) {
	//
	// 	var user = Meteor.user();
	//
	// 	if (!user || !Roles.userIsInRole(user, ['admin'])) {
	// 		throw new Meteor.Error(401, "AUTH_REQUIRED");
	// 	}
	//
	// 	var vpnUser = username.trim();
	// 	vpnUser = vpnUser.replace(/\s+/g, '');
	// 	// console.log(vpnUser);
	//
	// 	var spawn = Meteor.npmRequire('child_process').spawn;
	//
	// 	// gain sudo access
	// 	var sudo = spawn('su');
	// 	sudo.stderr.on('data', function(data) {
	// 		sudo.stdin.write('Elkmeat1' + '\n');
	// 	});
	//
	// 	var command = spawn('bash', ['newuser.sh', username], {stdio: ['pipe', 'pipe', 'pipe'], uid: 0});
	// 	var output = [];
	//
	// 	command.stdout.on('data', function(chunk) {
	// 		output.push(chunk);
	// 	});
	//
	// 	command.on('close', function(code) {
	// 		if (code !== 0) {
	// 			return 'Error: ' + code;
	// 		}
	//
	// 		return output[output.length - 1];
	// 	});
	// 	return 'Error: ' +  vpnUser + ' was not created.' ;
	// }
});
