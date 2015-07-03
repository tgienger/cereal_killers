angular.module('dragdrop', [])
.directive('uiDraggable', function() {
	return {
		restrict: 'A',
		scope: {model: '=uiDragModel'},
		link: function(scope, elem, attrs) {
			
			var helper = attrs.uiDragHelper || 'original';
			
			elem.draggable({
				helper: attrs.uiDragHelper
			}).data('model', scope.model);
		}
	};
})
.directive('uiDroppable', function() {
	return {
		restrict: 'A',
		scope: {callback: '&dropCallback'},
		link: function(scope, elem, attrs) {
			
			var accept = attrs.uiDropAccept,
				hoverClass = attrs.uiHoverClass;
				
			elem.droppable({
				hoverClass: hoverClass,
				accept: accept,
				drop: function(event, ui) {
					scope.callback({ui: ui});
				}
			});
		}
	};
});