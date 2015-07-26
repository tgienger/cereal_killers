/* global SimpleSchema, Meteor, Rules, Roles, SiteSettings */
var Schemas = {};

Schemas.NewsPosts = new SimpleSchema({
	subject: {
		type: String,
		max: 80,
		min: 5
	},
	markdown: {
		type: String,
		min: 5,
		autoValue: function() {
			var field = this.field('markdown');
			return  sanitizeHtml(field.value, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
			});
		}
	},
	username: {
		type: String,
		autoValue: function() {
			var user = Meteor.user();
			if (this.isInsert) {
				return user.username;
			}
		}
	},
	visible: {
		type: Boolean,
		autoValue: function() {

			var all = Rules.findOne({name: 'news'}).all;

			var field = this.field('visible');
			if (this.isInsert) {
				var setting = SiteSettings.find({}).fetch();
				return setting[0].news.visible;
			}
			if (this.isUpdate) {
				if (Roles.userIsInRole(this.userId, all)) {
					return field.value;
				}
			}
		}
	},
	private: {
		type: Boolean,
		autoValue: function() {
			var field = this.field('private');
			if (this.isInsert) {
				var setting = SiteSettings.find({}).fetch();
				return setting[0].news.private;
			} else if (this.isUpdate) {
				return field.value;
			}
		}
	},
	date: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else {
				this.unset();
			}
		}
	},
	latestDate: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpdate) {
				return new Date;
			} else {
				this.unset();
			}
		}
	},
	owner: {
		type: String,
		autoValue: function() {
	      if (this.isInsert) {
	        return this.userId;
	      } else if (this.isUpsert) {
	        return {$setOnInsert: this.userId};
	      } else {
	        this.unset();
	      }
		}
	},
	editHistory: {
		type: [Object],
		optional: true,
		autoValue: function() {
			var content = this.field('body');
			if (content.isSet) {
				if (this.isInsert) {
					return [{
						date: new Date,
						content: content.value
					}];
				} else {
					return {
						$push: {
							date: new Date,
							content: content.value
						}
					};
				}
			} else {
				this.unset();
			}
		}
	},
	'editHistory.$.date': {
		type: Date,
		optional: true
	},
	'editHistory.$.content': {
		type: String,
		optional: true
	}
});

News.attachSchema(Schemas.NewsPosts);


//Chat
Schemas.chatPosts = new SimpleSchema({
	 username: {
		type: String,
		autoValue: function() {
			var user = Meteor.user();
			if (this.isInsert) {
				return user.username;
			}
		}
	},
	userId: {
		type: String,
		autoValue: function() {
			if (this.isInsert) {
				return this.userId;
			} else {
				this.unset();
			}
		}
	},
	date: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			}
			else {
				this.unset();
			}
		}
	},
	message: {
		type: String,
		max: 150,
		autoValue: function() {
			var field = this.field('message');
			return sanitizeHtml(field.value, {
				allowedTags: ['a', 'img'],
				allowedAttributes: {
					'a': ['href'],
					'img': ['src']
				}
			});
		}
	}

});

Chat.attachSchema(Schemas.chatPosts);


Schemas.roles = new SimpleSchema({
	name: {
		type: String,
		index: true,
		unique: true,
		autoValue: function() {

			var all;
			var roles = Rules.findOne({name: 'roles'});
			if (roles) {
				all = roles.all
			}

			var field = this.field('name');

			if (this.isInsert) {
				if (Meteor.isServer) {
					return field.value;
				} else {
					this.unset();
				}
			} else if (this.isUpdate) {
				if (this.isFromTrustedCode) {
					return field.value;
				} else {
					this.unset();
				}
			}
		}
	}
});


Meteor.roles.attachSchema(Schemas.roles);

Schemas.mail = new SimpleSchema({
	recipient: {
		type: Object,
		autoValue: function() {
			var recipient = this.field('recipient');
			if (recipient.isSet()) {
				var user = Meteor.users.findOne({username: recipient});
				return {
					_id: user._id,
					username: user._id
				};
			}
		}
	},
	'recipient.$._id': {
		type: String
	},
	'recipient.$.username': {
		type: String
	},
	sender: {
		type: [Object],
		autoValue: function() {
			var user = Meteor.user();
			return {
				_id: user._id,
				usenrame: user.username
			};
		}
	},
	'sender.$._id': {
		type: String
	},
	'sender.$.username': {
		type: String
	},
	title: {
		type: String
	},
	body: {
		type: String
	}
});

Mail.attachSchema(Schemas.mail);


Schemas.Discussions = new SimpleSchema({

});
// Discussions.attachSchema(Schemas.Discussions);
Schemas.Comments = new SimpleSchema({
	'discussion_id': {
		type: String,
		autoValue: function() {
			// this is the id for the discussion "forum"
		}
	},
	'parent_id' : {
		type: String,
		autoValue: function() {
			// this is the _id of this posts parent post
		}
	},
	'slug': {
		type: String,
		autoValue: function() {

		}
	},
	'full_slug': {
		type: String,
		autoValue: function() {

		}
	},
	'posted': {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			}
		}
	},
	'author': {
		type: [Object],
		autoValue: function() {
			var user = Meteor.user();
			return {
				'id': user._id,
				'name': user.username
			};
		}
	},
	'author.$.id': {
		type: String
	},
	'author.$.name': {
		type: String
	},
	'text': {
		type: String,
	}

});
// Comments.attachSchema(Schemas.Comments);
