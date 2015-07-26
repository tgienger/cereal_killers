
function CurrentLocationDirective() {
    return {
        restrict: 'E',
        templateUrl: 'client/header/currentLocation/currentLocation.ng.html',
        scope: { header: '=' },
        link: function(scope, elem, attrs) {
            scope.currentLocation  = {
                header: scope.header
            }
        }
    }
}
