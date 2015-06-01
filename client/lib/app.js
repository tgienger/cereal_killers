angular.module('app', [
	'angular-meteor',
	'ui.router',
	'synergy.composer',
]);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});