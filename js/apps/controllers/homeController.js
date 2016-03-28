app.controller('homeController',function($scope,SharedDataService){

     $scope.currentUser= SharedDataService.getCurrentUser();
     console.log($scope.currentUser);
     if($scope.currentUser.eventlist.Eventlist){
     	for (var i = $scope.currentUser.eventlist.Eventlist.length - 1; i >= 0; i--) {
     		$scope.currentUser.eventlist.Eventlist[i]
     	};
     }


});