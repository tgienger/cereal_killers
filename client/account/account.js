angular.module('app').config(['$stateProvider',
function($stateProvider) {
    	
	$stateProvider
		.state('account', {
			url: '/account',
			templateUrl: 'client/account/account.controller.ng.html',
			controller: 'AccountController',
			resolve: {
                'currentUser': ['$meteor', function($meteor) {
                    return $meteor.requireUser();
                }]
            }
		})
		.state('acount.mail', {
			url: '/account/mail',
			templateUrl: 'client/account/mail/mail.ng.html',
			controller: 'MailController',
			resolve: {
				'currentUser': ['$meteor', function($meteor) {
					return $meteor.requireUser();
				}]
			}
		})
}]);

