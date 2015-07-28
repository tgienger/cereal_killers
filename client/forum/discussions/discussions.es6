
function DiscussionsConfig($stateProvider) {
    $stateProvider
        .state('discussion', {
            url: '/topic/:parent',
            templateUrl: 'client/forum/discussions/discussions.ng.html',
            controllerAs: 'discussion',
            controller: 'DiscussionsController'
        })
        .state('childTopic', {
            url: '/topic/:parent/:child',
            templateUrl: 'client/forum/discussions/discussions.ng.html',
            controllerAs: 'discussion',
            controller: 'SubDiscussionsController'
        });
}

DiscussionsConfig.$inject = ['$stateProvider'];
angular.module('app').config(DiscussionsConfig);
