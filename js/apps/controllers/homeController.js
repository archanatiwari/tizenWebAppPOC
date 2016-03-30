app.controller('homeController', function($scope, $state, SharedDataService) {

    $scope.currentUser = SharedDataService.getCurrentUser();
    // console.log($scope.currentUser);
    $scope.upcomingEvents=[];
	for (var i = 0; i < $scope.currentUser.eventList.length; i++){
		if($scope.currentUser.eventList[i].mystatus=="ACCEPTED"){
			$scope.currentUser.eventList[i].statusClass= "accepted";
		} else if($scope.currentUser.eventList[i].mystatus=="PENDING"){
			$scope.currentUser.eventList[i].statusClass= "pending";
		}else{
			$scope.currentUser.eventList[i].statusClass= "rejected";
		}
		var date = new Date($scope.currentUser.eventList[i].eventDate);
		if(date>= new Date()){
			$scope.upcomingEvents.push($scope.currentUser.eventList[i]);
		}
	}    

    for (var i = 0; i < $scope.currentUser.eventList.length; i++) {
        var date = new Date($scope.currentUser.eventList[i].eventDate);
        if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            $scope.currentUser.eventList[i].eventDate = "Today";
        }else {
            $scope.currentUser.eventList[i].eventDate = date;
        }
    };
    
    $scope.getEventDetails = function(eventObj){
    	SharedDataService.setEventData(eventObj);
    	//SharedDataService.setTargetData(eventObj.destination);
    	$state.go('navigation');
    }

});
