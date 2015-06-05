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
});