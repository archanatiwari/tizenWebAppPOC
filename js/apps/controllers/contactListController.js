app.controller('contactListController', function($scope, SharedFactory, SharedDataService){
	
//	$http.get('data/user-data.json').success(function(data){
//		$scope.userContacts = data.data;
//	});

	SharedFactory.getData().then(function(response){
		$scope.userContacts = response;
	}, function(response){
		$scope.userContacts = response;
	});
	$scope.time=  tizen.time.getCurrentDateTime().toDateString();
	console.log($scope.time);
//	var current_dt = tizen.time.getCurrentDateTime();
// 	alert("current date / time is " + current_dt.toLocaleString());

	
});