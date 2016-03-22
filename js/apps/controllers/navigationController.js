app.controller('navigationController', function($scope, $interval, GetUserData, SharedDataService) {
    $scope.next = 0;
    $scope.targetLocation = SharedDataService.getTargetData();

    var onSuccess = function(response) {
        $scope.userList = response.data;
        $scope.loadDirections();
    };

    var onError = function(response) {
        $scope.userList = [];
    }

    GetUserData.getData().then(onSuccess, onError);

    var bangalore = { lat: 12.9715987, lng: 77.5945627 };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: bangalore,
        // scrollwheel: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $scope.loadDirections = function() {
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        });

        // Set destination, origin and travel mode.
        var request = {
            origin: $scope.userList[0].source,
            destination: $scope.targetLocation,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Display the route on the map.
                directionsDisplay.setDirections(response);
            }
        });
    };

});