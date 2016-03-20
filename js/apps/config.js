var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/landing');
    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: 'partials/landing.html',
            controller: 'landingController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController'
        })
        .state('contactList', {
            url: '/contactList',
            templateUrl: 'partials/contactList.html',
            controller: 'contactListController'
        })
        .state('navigation', {
            url: '/navigation',
            templateUrl: 'partials/navigation.html',
            controller: 'navigationController'
        })

});