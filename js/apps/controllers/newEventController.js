app.controller('newEventController', function($scope, SharedDataService) {

    $scope.location = SharedDataService.getDestination();

    $scope.message = "This is page 1";

});
