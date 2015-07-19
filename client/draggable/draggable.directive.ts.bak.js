/// <reference path="../../typings/tsd.d.ts" />
var Draggable = (function () {
    function Draggable($document) {
        var _this = this;
        this.startX = 0;
        this.startY = 0;
        this.x = 0;
        this.y = 0;
        this.restrict = 'A';
        this.scope = {};
        this.link = function (scope, element, attrs) {
            _this.mousemove = function (event) {
                _this.y = event.pageY - _this.startY;
                _this.x = event.pageX - _this.startX;
                element.css({
                    position: 'relative',
                    top: _this.y + 'px',
                    left: _this.x + 'px'
                });
            };
            _this.mouseup = function (event) {
                $document.off('mousemove touchmove', _this.mousemove);
                $document.off('mouseup touchend', _this.mouseup);
            };
            element.on('touchstart mousedown', function (event) {
                event.preventDefault();
                _this.startX = event.pageX - _this.x;
                _this.startY = event.pageY - _this.y;
                $document.on('mousemove touchmove', mousemove);
                $document.on('mousemove touchmove', mouseup);
            });
        };
    }
    Draggable.$inject = ['$document'];
    return Draggable;
})();
//# sourceMappingURL=draggable.directive.js.map