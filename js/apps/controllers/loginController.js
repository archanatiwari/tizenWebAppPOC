app.controller('loginController' ,function($scope,$http,$location){
	$scope.userContacts= [];
	$http.get('data/user-data.json').success(function(data){
		$scope.userContacts = data.data;

	});
	$scope.login= function(){
		angular.forEach($scope.userContacts, function(user, key){
			if(user.email==$scope.email){
				$scope.currentUser=user.name;
				$location.path('/contactList');
			
			}
			
		})
	}
	
	
});