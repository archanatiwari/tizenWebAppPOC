app.controller('contactListController', function($scope, $http){
	
	$http.get('data/user-data.json').success(function(data){
		$scope.userContacts = data.data;
	});
	
	$scope.time=  tizen.time.getCurrentDateTime().toDateString();
	console.log($scope.time);
//	var current_dt = tizen.time.getCurrentDateTime();
// 	alert("current date / time is " + current_dt.toLocaleString());

	
});