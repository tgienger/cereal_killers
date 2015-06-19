angular.module('mailDirectives', [])
.directive('mailCount', function() {
	return {
		restrict: 'AE',
		scope: {},
		template: '<span class="pull-right messages-count"><a href="/account"> <i class="mdi-content-mail"></i> <i ng-if="mail.count > 0" class="new badge">{{mail.count}}</i></a><span>',
		link: function(scope, elem, attr) {
			scope.mail = {
				count: 0
			};	
		}, 
		
	};
})
.directive('mail', ['$meteor', function($meteor) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'client/mail-directive/mail.directive.ng.html',
		link: function(scope, elem, attr) {
			
			scope.perPage = attr.limit || 25;
			scope.page = 1;
			scope.sort = {dateCreated: -1};
			
			
			
			// Subscribe to the mail collection
			$meteor.autorun(scope, function() {
				scope.$meteorSubscribe('news', {visible: true}, {
					limit: scope.getReactively('perPage'),
					skip: parseInt((scope.getReactively('page') - 1) * scope.getReactively('perPage')),
					sort: scope.getReactively('sort')
				}).then(function(handle) {
					newsSubHandle = handle;
				});
				
				
				// insert my mail (received) into the scope
				scope.mail = $meteor.collection(function() {
					return News.find({}, {
						sort: scope.getReactively('sort')
					});
				});
				
			});
			
			
		}
	};
}]);