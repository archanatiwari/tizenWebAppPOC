app.controller('landingController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

	(function(){

		if((localStorage) && (localStorage.getItem('registeredUser') != null)){
			var userId = localStorage.getItem('registeredUser');
			SharedDataService.getUserInfoFromDb(userId, function(response){
                SharedDataService.getContactsFromDb(userId, function(res){
                	 $state.go('home');
                }, function(res){
              	});
               
            }, function(response){
                 localStorage.removeItem('registeredUser');
            });
		}
		else{
			$state.go('login');
		}

	})();

}]);