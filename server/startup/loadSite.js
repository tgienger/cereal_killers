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
	
});