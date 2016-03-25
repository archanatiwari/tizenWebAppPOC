var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
<<<<<<< HEAD
    $urlRouterProvider.otherwise('/login');
=======
    $urlRouterProvider.otherwise('/home');
>>>>>>> 17e6f1857753c9a72e97c9e506a24f7afd62f1b9
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            controller: 'homeController'
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
        .state('details', {
            url: '/details',
            templateUrl: 'partials/details.html',
            controller: 'detailsController'
        })
        .state('navigation', {
            url: '/navigation',
            templateUrl: 'partials/navigation.html',
            controller: 'navigationController'
        })

});