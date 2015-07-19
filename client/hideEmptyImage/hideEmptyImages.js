angular.module('hideEmptyImages', [])
.directive('hideEmptyImages', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.error(function(err) {
				attrs.$set('ngSrc', '/images/member.png');
				// elem.hide();
			});
		}
	};
});