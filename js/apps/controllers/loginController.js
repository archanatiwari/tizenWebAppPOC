app.controller('loginController', function($scope, $http, $state, SharedFactory, SharedDataService) {
    $scope.userContacts = [];
    $scope.errorMsg = false;
    //  $http.get('data/user-data.json').success(function(data){
    //      $scope.userContacts = data.data;
    //
    //  });

    $scope.email = "archit.soni@globant.com", $scope.password = "1234";

    SharedFactory.getData().then(function(response) {
        $scope.userContacts = response;
    }, function(response) {
        $scope.userContacts = response;
    });

    $scope.login = function() {
        var userContacts = $scope.userContacts;
        for (var i = 0; i < userContacts.length; i++) {
            var user = userContacts[i];
            if (user.email == $scope.email && user.password == $scope.password) {
                SharedDataService.setCurrentUser(user);
                $state.go('home');
                break;
            } else {
                $scope.errorMsg = true;
            }
        }
    }
});
