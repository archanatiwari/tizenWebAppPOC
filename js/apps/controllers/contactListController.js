app.controller('contactListController', function($scope, $state, SharedFactory, SharedDataService) {

    //	$http.get('data/user-data.json').success(function(data){
    //		$scope.userContacts = data.data;
    //	});

    SharedFactory.getData().then(function(response) {
        $scope.userContacts = response;
    }, function(response) {
        $scope.userContacts = response;
    });

    $scope.previousPage = function() {
        $state.go('newEvent');
    };
    $scope.addedUsers = [];
    $scope.addContacts = function() {
        angular.forEach($scope.userContacts, function(checkedUser, key) {
            if (checkedUser.checked) {
                $scope.addedUsers.push(checkedUser.name);
                
            }
        })
        SharedDataService.setAddedUsers($scope.addedUsers);
        $state.go('newEvent');
    };

    
    // $scope.time=  tizen.time.getCurrentDateTime().toDateString();
    // console.log($scope.time);
    //	var current_dt = tizen.time.getCurrentDateTime();
    // 	alert("current date / time is " + current_dt.toLocaleString());

});
