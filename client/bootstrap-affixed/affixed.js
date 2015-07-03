angular.module('BootstrapAffixed', [])
.directive('affixed', ['$window', function($window) {
	return {
		restrict: 'A',
		scope: {affixed: '='},
		require: '^scrollSpy',
		link: function(scope, elem, attrs) {
			
			elem.affix({
				offset: {
					top: scope.affixed.top,
					bottom: scope.affixed.bottom
				}
			});
			
		}
	};
}])
.directive('scrollSpy', ['$window', function($window) {
	return {
		restrict: 'A',
		controller: ['$scope', function($scope) {
			
			$scope.spies = [];
			
			return this.addSpy = function(spyObj) {
				return $scope.spies.push(spyObj);
			};
			
		}],
		link: function(scope, elem, attrs) {
			// scope.currentRule = {name: ''};
			var spyElems = [];
			
			
			scope.$watch('spies', function(spies) {
		        // console.log('$watch', spies);
				for (var _i = 0; _i < spies.length; _i++) {
					var spy = spies[_i];
					if (spyElems[spy.id] == null) {
						spyElems[spy.id] = (elem.find('#' + spy.id));
					}
				}
			}, true);

			
			angular.element($window).scroll(function() {
				
				var currentSpy, i, len, pos, ref, spy;
				currentSpy = null;
				ref = scope.spies;
				
				for (i = 0, len = ref.length; i< len; i++) {
					spy = ref[i];
					spy.out();
					spyElems[spy.id] = spyElems[spy.id].length === 0 ? elem.find('#' + spy.id) : spyElems[spy.id];
					
					if (spyElems[spy.id].length !== 0) {
						if ((pos = spyElems[spy.id].offset().top) - $window.pageYOffset <= 80) {
							spy.pos = pos;
							if (currentSpy == null) {
								currentSpy = spy;
							}
							if (currentSpy.pos < spy.pos) {
								currentSpy = spy;
							}
						}
					}
				}
				return currentSpy != null ? currentSpy['in']() : void 0;
			});
		}
	};
}])
.directive('spy', ['$location', function($location) {
	return {
		restrict: 'A',
		require: '^scrollSpy',
		scope: {setCurrentRule: '&'},
		link: function(scope, elem, attrs, scrollSpy) {
			scope.names = 'bob';
			if (attrs.spyClass == null) {
				attrs.spyClass = 'current';
			}
			
			elem.click(function() {
				return scope.$apply(function() {
					return $location.hash(attrs.spy);
				});
			});
			
			return scrollSpy.addSpy({
				id: attrs.spy,
				'in': function() {
					return scope.setCurrentRule({scrolledRule: this.id});
				},
				out: function() {
					return scope.setCurrentRule({scrolledRule: ''});
					// return;
				}
			});
			
		}
	};
}]);