app.controller('inviteeListController', ['$scope', 'SharedDataService', function($scope, SharedDataService) {
    $scope.selectedEvent = SharedDataService.getEventData();
    $scope.inviteeList = $scope.selectedEvent.invitee_list;
    $scope.statusText;
    $scope.status= "";

    for (var i = 0; i<$scope.inviteeList.length; i++) {
        if ($scope.inviteeList[i].status == "ACCEPTED") {
            $scope.inviteeList[i].statusClass = "accepted";
        } else if ($scope.inviteeList[i].status == "PENDING") {
            $scope.inviteeList[i].statusClass = "pending";
        } else {
            $scope.inviteeList[i].statusClass = "rejected";
        }

    }

    if ($scope.selectedEvent.status == "pending") {
        $scope.statusText = "You haven't dicided yet"
        $scope.status = "pending";


    }else if($scope.selectedEvent.status == "accepted"){
    	$scope.statusText = "You are going to this event"
        $scope.status = "accepted";
    }
    else{
    	$scope.status = "rejected";
    }

}]);
