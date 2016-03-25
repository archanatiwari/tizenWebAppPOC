app.controller('detailsController', function($scope, $interval, GetUserData, SharedDataService) {

    $scope.inputText = document.getElementById('pac-input');
    $scope.searchBox = new google.maps.places.SearchBox($scope.inputText);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    $scope.searchBox.addListener('places_changed', function() {
        $scope.places = $scope.searchBox.getPlaces();
        if ($scope.places.length == 0) {
            return;
        }
        // For each place, get the name and location.
        $scope.places.forEach(function(place) {
            $scope.targetName = place.name;
            $scope.targetLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            SharedDataService.setTargetData($scope.targetLocation);
        });
    });
    $scope.currentUser = SharedDataService.getCurrentUser();
    alert($scope.currentUser);
});