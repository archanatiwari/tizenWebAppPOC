app.controller('homeController',function($scope,SharedDataService){

     $scope.currentUser= SharedDataService.getCurrentUser();
     console.log($scope.currentUser);

});