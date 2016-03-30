app.controller('newEventController', function($scope, SharedDataService) {
    $scope.users = SharedDataService.getAddedUsers;
    $scope.location = SharedDataService.getDestination();
    if ($scope.users.length != 0) {
        $scope.addedUsers = $scope.users.join('/ ');
    }

    var d = new Date();

    var h = d.getHours();
    var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var ampm = h >= 12 ? 'p.m.' : 'a.m.s';
    var hours = h >= 12 ? h - 12 : h;
    $scope.eventTime = hours + ':' + m + ' ' + ampm;
    $scope.eventDate = d;


});
