var app=angular.module('myApp', ['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/page1');
        $stateProvider
             .state('page1',{
              url:'/page1',
              templateUrl: 'partials/page1.html',
                controller: 'page1Controller'      
              })
              .state('page2',{
              url:'/page2',
              templateUrl: 'partials/page2.html',
              controller: 'page2Controller'
              })

});





//window.onload = function() {
//    // TODO:: Do your initialization job
//
//    // add eventListener for tizenhwkey
//	'use strict';
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