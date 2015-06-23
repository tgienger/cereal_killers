angular.module('hideEmptyImages', [])
.directive('hideEmptyImages', function() {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			elem.error(function(err) {
				elem.hide();
			});
		}
	};
});