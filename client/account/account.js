
/**
 * App Config
 * returns Config
 */
var Config = (function() {
	
	/**
	 * App Config Constructor
	 * @param {!angular.$stateProvider} $stateProvider
	 */
	function Config($stateProvider) {
		
		$stateProvider
			// Account state
			.state('account', {
				url: '/account',
				templateUrl: 'client/account/account.controller.ng.html',
				controllerAs: 'account',
				controller: 'AccountController',
				// This resolve requires there to be a user logged in
				resolve: {
	                'currentUser': ['$meteor', function($meteor) {
	                    return $meteor.requireUser();
	                }]
	            }
			})
			// Account Mail state
			.state('acount.mail', {
				url: '/account/mail',
				templateUrl: 'client/account/mail/mail.ng.html',
				controller: 'MailController',
				controllerAs: 'mail',
				// This resolve requires there to be a user logged in
				resolve: {
					'currentUser': ['$meteor', function($meteor) {
						return $meteor.requireUser();
					}]
				}
			});
		
	}
	
	return Config;
	
}());

// Angular dependency injection
Config.$inject = ['$stateProvider'];

// attach config to 'app'
angular.module('app').config(Config);

