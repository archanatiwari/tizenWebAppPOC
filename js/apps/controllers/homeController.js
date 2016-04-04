app.controller('homeController', function($scope, $state, SharedDataService) {
    $scope.eventMemberList = function(inviteeList) {
        $scope.customisedInviteeList = "";
        $scope.arrivedPpl = [];
        var str = "";
        //doing this for customizing invitee list
        for (var i = 0; i < inviteeList.length; i++) {
            var invitee = inviteeList[i].name;
            if (inviteeList.length == 1) {
                $scope.customisedInviteeList = invitee;
                break;
            }
            if (inviteeList.length <= 4) {
                if (inviteeList[i + 1]) {
                    str += invitee;
                    if (inviteeList[i + 2])
                        str += ", ";
                } else {
                    str += " and " + invitee;
                    $scope.customisedInviteeList = str;
                    break;
                }
            } else {
                if (i <= 3) {
                    str += invitee;
                    if (i < 3)
                        str += ", ";
                } else {
                    var remainingPpl = inviteeList.length - i;
                    str += " and " + remainingPpl + " more";
                    $scope.customisedInviteeList = str;
                    break;
                }
            }
        }
        return $scope.customisedInviteeList
    }

    $scope.currentUser = SharedDataService.getCurrentUser();
    // console.log($scope.currentUser);
    $scope.upcomingEvents = [];
    for (var i = 0; i < $scope.currentUser.eventList.length; i++) {
        if ($scope.currentUser.eventList[i].mystatus == "ACCEPTED") {
            $scope.currentUser.eventList[i].statusClass = "accepted";
        } else if ($scope.currentUser.eventList[i].mystatus == "PENDING") {
            $scope.currentUser.eventList[i].statusClass = "pending";
            $scope.currentUser.eventList[i].customisedInviteeList = $scope.eventMemberList($scope.currentUser.eventList[i].inviteeList);
        } else {
            $scope.currentUser.eventList[i].statusClass = "rejected";
        }

        var date = new Date($scope.currentUser.eventList[i].eventDate);
        if (date >= new Date()) {
            $scope.upcomingEvents.push($scope.currentUser.eventList[i]);
        }
    }

    for (var i = 0; i < $scope.currentUser.eventList.length; i++) {
        var date = new Date($scope.currentUser.eventList[i].eventDate);
        if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            $scope.currentUser.eventList[i].displayDate = "Today";
        } else {
            $scope.currentUser.eventList[i].displayDate = date;
        }
    };


    $scope.getEventDetails = function(eventObj) {
        SharedDataService.setEventData(eventObj);
        //SharedDataService.setTargetData(eventObj.destination);
        $state.go('navigation');
    }



});
