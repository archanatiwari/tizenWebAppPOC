app.controller('loginController' ,function($scope,$http,$state,SharedDataService){
	$scope.userContacts= [];
	$scope.errorMsg=false;
	$http.get('data/user-data.json').success(function(data){
		$scope.userContacts = data.data;

	});
	$scope.login= function(){
		var userContacts = $scope.userContacts;
		//angular.forEach($scope.userContacts, function(user, key){ //do not use forEach, as there is no option to break the loop
		for(var i=0; i<userContacts.length;i++){
			var user = userContacts[i];
			if(user.email==$scope.email && user.password==$scope.password){
				SharedDataService.setCurrentUser(user);
				$state.go('home');
				break;
			}else{
				$scope.errorMsg=true;
			}
		}
		//})
	}
	
	
});