
function OnBlurDirective() {
    return {
        restrict: 'A',
        // scope: { thisFunction: '&'},
        link: function(scope, elem, attrs) {
            elem.on('blur', function() {
                alert('poop');
                // scope.thisFunction()();
            });
        }
    };
}

OnBlurDirective.$inject = [];

angular.module('app').directive('hideOnBlur', OnBlurDirective);
