/// <reference path="../../typings/angularjs/angular.d.ts"/>
angular.module('app').config(['$stateProvider',
function($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'client/home/home.controller.ng.html',
			controllerAs: 'home',
			controller: 'HomeCtrl'
		});
}]);