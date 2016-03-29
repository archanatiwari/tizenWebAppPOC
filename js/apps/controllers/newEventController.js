app.controller('newEventController',function($scope, SharedDataService){

      $scope.message="This is page 1";
      $scope.AddedUsers = SharedDataService.getAddedUsers;

});