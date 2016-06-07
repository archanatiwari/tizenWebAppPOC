app.controller('landingController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

	(function(){

		if((localStorage) && (localStorage.getItem('registeredUser') != null)){
			var userId = localStorage.getItem('registeredUser');
			SharedDataService.getUserInfoFromDb(userId, function(response){
                $state.go('home');
            }, function(response){
                 localStorage.removeItem('registeredUser');
            });
		}
		else{
			$state.go('login');
		}

	})();

}]);