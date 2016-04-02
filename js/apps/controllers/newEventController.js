app.controller('newEventController', function($scope,$timeout, SharedDataService) {

    $scope.users = SharedDataService.getAddedUsers;
    $scope.location = SharedDataService.getDestination();

    $scope.eventName = SharedDataService.getEventName();
    if ($scope.eventName) {
        $scope.eventName;
    }else{
        $scope.eventName = "";
    }

    $scope.updateEventName = function() {
        SharedDataService.setEventName($scope.eventName);
    }


    if ($scope.users.length != 0) {
        $scope.addedUsers = $scope.users.join(' / ');
    }

    var d = new Date();

    var h = d.getHours();
    var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var ampm = h >= 12 ? 'p.m.' : 'a.m.';
    var hours = h >= 12 ? h - 12 : h;
    $scope.eventTime = hours + ':' + m + ' ' + ampm;
    $scope.eventDate = d;

});

