app.controller('locationController', function($scope, $state, $interval, SharedDataService) {

    $scope.inputText = document.getElementById('pac-input');
    $scope.searchBox = new google.maps.places.SearchBox($scope.inputText);
    $scope.location = "";
    $scope.newEventName = SharedDataService.getEventName();
    
    // $scope.targetName = [];
    $scope.recentSearchedPlaces = SharedDataService.getRecentlySearchedData();

    if ($scope.recentSearchedPlaces) {

        $scope.recentSearchedPlaces ;
    } else {
        $scope.recentSearchedPlaces= [];
    }



    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    $scope.searchBox.addListener('places_changed', function() {
        $scope.places = $scope.searchBox.getPlaces();
        $scope.location = $scope.places[0].name + ", " + $scope.places[0].formatted_address;
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
    //alert($scope.currentUser);
    $scope.setLocation = function() {
        SharedDataService.setDestination($scope.location);
        $state.go('newEvent');
    }
    $scope.setRecentSearch = function() {
        $scope.recentSearchedPlaces.push($scope.targetName);
        // $scope.searchedData = $scope.searchedData.concat($scope.recentSearchedPlaces)
        SharedDataService.setRecentlySearchedData($scope.recentSearchedPlaces);
    };
    // $scope.getRecentSearchAgain = function() {
    //     $scope.loadRecentPlaces = SharedDataService.getRecentlySearchedData();
    // };
    // $scope.getRecentSearchAgain();
});
