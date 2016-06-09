app.controller('locationController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

    var inputText = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(inputText);
    var locationName, locationCoords;
    //$scope.newEventName = SharedDataService.getEventName();
    $scope.eventLocation = "";
    
    $scope.recentSearchedPlaces = SharedDataService.getRecentlySearchedData();

    // if ($scope.recentSearchedPlaces) {
    //     $scope.recentSearchedPlaces;
    // } else {
    //     $scope.recentSearchedPlaces= [];
    // }

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var searchResults = searchBox.getPlaces();
        if (searchResults.length > 0) {
            var selectedPlace = searchResults[0];
            $scope.eventLocation = selectedPlace.name + ", " + selectedPlace.formatted_address;
            locationName = selectedPlace.name;
            locationCoords = { lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng() };
            // For each place, get the name and location.
            // searchResults.forEach(function(place) {
            //     $scope.targetName = place.name;
            //     $scope.targetLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            //     //SharedDataService.setTargetData($scope.targetLocation);
            // });
        }
    });

    $scope.setLocation = function() {
        SharedDataService.setDestAddress($scope.eventLocation);
        SharedDataService.setDestCoordinates(locationCoords);
        $scope.setRecentSearch();
        $state.go('newEvent');
    };

    $scope.setRecentSearch = function() {
        var obj = {
            name : locationName,
            address : $scope.eventLocation,
            coordinates : locationCoords
        };
        //var recentSearches = $scope.recentSearchedPlaces;
        // for(var i=0; i<recentSearches.length; i++){
        //     if((recentSearches[i].coordinates.lat == locationCoords.lat) && (recentSearches[i].coordinates.lng == locationCoords.lng))
        // }
        if($scope.recentSearchedPlaces.length >= 5){
            $scope.recentSearchedPlaces.pop();
        }
        $scope.recentSearchedPlaces.unshift(obj); //unshift will add at begining
        SharedDataService.setRecentlySearchedData($scope.recentSearchedPlaces);
    };

    $scope.chooseSelectedLocation = function(index){
        var selectedLocation = $scope.recentSearchedPlaces[index]; 
        $scope.eventLocation = selectedLocation.address;
        locationName = selectedLocation.name;
        locationCoords =selectedLocation.coordinates;
    };
   
}]);
