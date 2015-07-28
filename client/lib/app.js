angular.module('app', [
	'angular-meteor',
	'ui.router',
	'synergy.composer',
	'camelCaseFilter',
	'resizeDirective',
	'mailDirectives',
	'ngAnimate',
	'truncate',
	'hideEmptyImages',
	'dragdrop',
	'BootstrapAffixed',
	'RecursionHelper',
	'MeteorMarkdown',
	'infinite-scroll',
	'ngTouch',
])
.run(['$rootScope', function($rootScope) {
	$rootScope.siteName = 'CK Gaming';
	Session.set('chatTimeStart', moment().toDate());
}]);

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
