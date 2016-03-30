app.controller('inviteeListController', function($scope, SharedDataService) {
    $scope.selectedEvent = SharedDataService.getEventData();
    $scope.inviteeList = $scope.selectedEvent.inviteeList;
    $scope.statusText;
    $scope.mystatus= "";

    for (var i = 0; i < $scope.inviteeList.length; i++) {
        if ($scope.inviteeList[i].status == "ACCEPTED") {
            $scope.inviteeList[i].statusClass = "accepted";
        } else if ($scope.inviteeList[i].status == "PENDING") {
            $scope.inviteeList[i].statusClass = "pending";
        } else {
            $scope.inviteeList[i].statusClass = "rejected";
        }

    }

    if ($scope.selectedEvent.mystatus == "PENDING") {
        $scope.statusText = "You haven't dicided yet"
        $scope.mystatus = "pending";


    }else if($scope.selectedEvent.mystatus == "ACCEPTED"){
    	$scope.statusText = "You are going to this event"
        $scope.mystatus = "accepted";
    }
    else{
    	$scope.mystatus = "rejected";
    }

});
