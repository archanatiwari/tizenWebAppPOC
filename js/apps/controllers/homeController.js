app.controller('homeController', function($scope, SharedDataService) {

    $scope.currentUser = SharedDataService.getCurrentUser();
    // console.log($scope.currentUser);
    $scope.upcomingEvents=[];
	for (var i = 0; i < $scope.currentUser.eventlist.EventList.length; i++){
		var date = new Date($scope.currentUser.eventlist.EventList[i].EventDate);
		if(date>= new Date()){
			$scope.upcomingEvents.push($scope.currentUser.eventlist.EventList[i]);
		}
	}    

    for (var i = 0; i < $scope.currentUser.eventlist.EventList.length; i++) {
        var date = new Date($scope.currentUser.eventlist.EventList[i].EventDate);
        if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            $scope.currentUser.eventlist.EventList[i].EventDate = "Today";
        } else if (date.getDate() == new Date().getDate() + 1 && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            $scope.currentUser.eventlist.EventList[i].EventDate = "Tomorrow";
        } else {
            $scope.currentUser.eventlist.EventList[i].EventDate = date;
        }
    }

});
