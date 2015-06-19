angular.module('app', [
	'angular-meteor',
	'ui.router',
	'synergy.composer',
	'camelCaseFilter',
	'resizeDirective',
	'mailDirectives',
	'ngAnimate'
]);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});