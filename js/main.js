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





//window.onload = function() {
//    // TODO:: Do your initialization job
//
//    // add eventListener for tizenhwkey
//  'use strict';
//    document.addEventListener('tizenhwkey', function(e) {
//        if (e.keyName === "back") {
//            try {
//                tizen.application.getCurrentApplication().exit();
//            } catch (ignore) {}
//        }
//    });
//
//    // Sample code
//    var mainPage = document.querySelector('#main');
//
//    mainPage.addEventListener("click", function() {
//        var contentText = document.querySelector('#content-text');
//
//        contentText.innerHTML = (contentText.innerHTML === "Basic") ? "Tizen" : "Basic";
//    });
//};
