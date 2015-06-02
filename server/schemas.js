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
				return true;
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
				return field.value;
			} else if (this.isUpdate) {
				return field.value;
			}
		}
	},
	date: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				console.log('NEW INSERT');
				return new Date;
			} else {
				console.log('UNSET');
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
//	editHistory: {
//		type: [Object],
//		optional: true,
//		autoValue: function() {
//			var content = this.field('body');
//			if (content.isSet) {
//				if (this.isInsert) {
//					return [{
//						date: new Date,
//						content: content.value
//					}];
//				} else {
//					return {
//						$push: {
//							date: new Date,
//							content: content.value
//						}
//					};
//				}
//			} else {
//				this.unset();
//			}
//		}
//	},
//	'editHistory.$.date': {
//		type: Date,
//		optional: true
//	},
//	'editHistory.$.content': {
//		type: String,
//		optional: true
//	}
});

News.attachSchema(Schemas.NewsPosts);