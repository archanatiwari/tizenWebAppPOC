app.controller('newEventController', function($scope, SharedDataService) {
    $scope.users = SharedDataService.getAddedUsers;
    $scope.location = SharedDataService.getDestination() || '';
    $scope.newEventName = SharedDataService.getEventName() || '';
    if ($scope.newEventName !== "") {
        $scope.eventName = $scope.newEventName;
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

    $scope.setName = function() {
        SharedDataService.setEventName($scope.eventName);
    };
})
