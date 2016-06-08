app.controller('contactListController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

    $scope.userContacts = SharedDataService.getUserContacts();

    $scope.previousPage = function() {
        $state.go('newEvent');
    };
    $scope.addedUsers = [];

    $scope.addContacts = function() {
        angular.forEach($scope.userContacts, function(checkedUser, key) {
            if (checkedUser.checked) {
                $scope.addedUsers.push(checkedUser);
            }
        });
        SharedDataService.setAddedUsers($scope.addedUsers);
        $state.go('newEvent');
    };


    // $scope.time=  tizen.time.getCurrentDateTime().toDateString();
    // console.log($scope.time);
    //  var current_dt = tizen.time.getCurrentDateTime();
    //  alert("current date / time is " + current_dt.toLocaleString());

}]);
