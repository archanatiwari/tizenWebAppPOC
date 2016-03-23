app.controller('contactListController', function($scope, $http){
	
	$http.get('data/user-data.json').success(function(data){
		$scope.userContacts = data.data;
	});
	
});