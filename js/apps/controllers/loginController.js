app.controller('loginController' ,function($scope,$http,$location,SharedDataService){
	$scope.userContacts= [];
	$scope.errorMsg=false;
	$http.get('data/user-data.json').success(function(data){
		$scope.userContacts = data.data;

	});
	$scope.login= function(){
		angular.forEach($scope.userContacts, function(user, key){
			$scope.email = "archit.soni@globant.com";
			$scope.password = 1234;
			if(user.email==$scope.email && user.password==$scope.password){
				SharedDataService.setCurrentUser(user);
				$location.path('/home');
			}else{
				$scope.errorMsg=true;
			}
			
		})
	}
	
	
});