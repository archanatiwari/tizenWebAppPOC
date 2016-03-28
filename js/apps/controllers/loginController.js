app.controller('loginController', function($scope, $http, $state, SharedDataService) {
    $scope.userContacts = [];
    $scope.errorMsg = false;

    $http.get('data/user-data.json').success(function(data) {
        $scope.userContacts = data.data;

    });
    $scope.login = function() {
        $scope.username = document.getElementById('username').value;
        $scope.password = document.getElementById('password').value;
        var userContacts = $scope.userContacts;
        angular.forEach($scope.userContacts, function(user, key) {
            if (user.email == $scope.username && user.password == $scope.password) {
                SharedDataService.setCurrentUser(user);
                $state.go('home');
            } else {
                return $scope.errorMsg = true;
            }
        })
    }
});