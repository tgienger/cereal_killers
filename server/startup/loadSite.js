/* global Roles */
/* global Meteor */
Meteor.startup(function() {
	var adminId;
	
	if (Meteor.users.find().count() === 0) {
		adminId = Accounts.createUser({
			username: 'Admin',
			email: 'admin@ck-gaming.com',
			password: '@dminP@ssw0rd',
			profile: {firstName: 'Admin',
			lastName: 'SuperUser',
			bio: 'I\'m the admin, yo'}
		});
		
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
			all: ['admin', 'superModerator'],
			view: ['admin', 'superModerator', 'member'],
			insert: ['admin', 'superModerator'],
			update: ['admin', 'superModerator'],
			remove: ['admin', 'superModerator']
		});
		Rules.insert({
			name: 'roles',
			all: ['admin', 'superModerator'],
			view: ['admin', 'superModerator', 'member'],
			insert: ['admin', 'superModerator'],
			update: ['admin', 'superModerator'],
			remove: ['admin', 'superModerator']
		});
		Rules.insert({
			name: 'chat',
			all: ['admin', 'superModerator'],
			view: ['admin', 'superModerator', 'member'],
			insert: ['admin', 'superModerator'],
			update: ['admin', 'superModerator'],
			remove: ['admin', 'superModerator']
		});
		Rules.insert({
			name: 'settings',
			all: ['admin', 'superModerator'],
			view: ['admin', 'superModerator'],
			insert: ['admin', 'superModerator'],
			update: ['admin', 'superModerator'],
			remove: ['admin', 'superModerator']
		});
		Rules.insert({
			name: 'users',
			all: ['admin'],
			view: ['admin', 'superModerator', 'member'],
			insert: ['admin', 'superModerator'],
			update: ['admin', 'superModerator'],
			remove: ['admin', 'superModerator']
		});
	}
	
});