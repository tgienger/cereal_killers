/* global SimpleSchema */
var Schemas = {};

Schemas.NewsPosts = new SimpleSchema({
	title: {
		type: String,
		max: 80,
		min: 5
	},
	body: {
		type: String,
		min: 5
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
			var field = this.field('visible');
			if (this.isInsert) {
				var setting = SiteSettings.find({}).fetch();
				console.log(setting);
				return setting[0].news.visible;
			}
			if (this.isUpdate) {
				if (Roles.userIsInRole(this.userId, ['admin'])) {
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
		max: 150
	}
	
});

Chat.attachSchema(Schemas.chatPosts);


Schemas.roles = new SimpleSchema({
	name: {
		type: String,
		autoValue: function() {
			
			var field = this.field('name');
			
			if (this.isInsert) {
				if (Roles.userIsInRole(Meteor.user()._id, ['admin', 'rolesAdmin'])) {
					return field.value;
				} else {
					this.unset();
				}
			}
		}
	}
});


Meteor.roles.attachSchema(Schemas.roles);