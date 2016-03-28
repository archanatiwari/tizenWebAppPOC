var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
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

app.run(function($rootScope){
	$rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams){ 
				//if(toState.name != "login"){
				loadJsFile('js/libs/tau/mobile/js/tau.js');
				//}
			});
});

function loadJsFile(url){
    var fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", url);
}