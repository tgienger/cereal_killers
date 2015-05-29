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
	visible: {
		type: Boolean,
		autoValue: function(val) {
			console.log(val);
			if (this.isInsert) {
				return true;
			}
			if (this.isUpdate) {
				return val;
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
			} else if (this.isUpdate && this.isFromTrustedCode) {
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