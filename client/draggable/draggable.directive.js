angular.module('app').directive('draggable', function($document) {
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element, attrs) {
			
			var startX = 0, startY = 0, x = 0, y = 0;
			
			
			function mousemove(event) {
				y = event.pageY - startY;
				x = event.pageX - startX;
				element.css({
					position: 'relative',
					top: y + 'px',
					left: x + 'px'
				});
			}
			function mouseup() {
				console.log(element[0].innerText);
				$document.off('touchmove mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}
			
			element.on('touchstart mousedown', function(event) {
				event.preventDefault();
				startX = event.pageX - x;
				startY = event.pageY - y;
				$document.on('mousemove touchmove', mousemove);
				$document.on('mouseup touchend', mouseup);
			});
		}
	};
});