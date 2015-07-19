
function DiscussionsConfig($stateProvider) {
    $stateProvider
        .state('discussion', {
            url: '/topic/:parent',
            templateUrl: 'client/forum/discussions/discussions.ng.html',
            controllerAs: 'discussion',
            controller: 'DiscussionsController'
        });
}

DiscussionsConfig.$inject = ['$stateProvider'];
angular.module('app').config(DiscussionsConfig);
