app.controller('navigationController', function($scope, $interval, GetUserData) {
    
	var next = -1, destinationReached = 0, tracker;
    $scope.traversingData = [];

    var onSuccess = function(response) {
        $scope.userList = response.data;
        $scope.loadMap();
        //$scope.updateData();
    };

    var onError = function(response) {
        $scope.userList = [];
    }

    GetUserData.getData().then(onSuccess, onError);

    var bangalore = { lat: 12.9715987, lng: 77.5945627 };
    var hsrLayout = { lat: 12.9081357, lng: 77.647608 };
    
    var next = 0;

    var map = new google.maps.Map(document.getElementById('map'), {
        center: bangalore,
        // scrollwheel: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $scope.loadDirections = function() {
    	var userList = $scope.userList;
	    
    	userList.forEach(function(value,index){
		    	
			var directionsDisplay = new google.maps.DirectionsRenderer({
				map: map
		    });
	    	
	    	// Set destination, origin and travel mode.
	        var request = {
	            destination: $scope.targetLocation,
	            origin: userList[index].source,
	            travelMode: google.maps.TravelMode.DRIVING
	        };
	
	        // Pass the directions request to the directions service.
	        var directionsService = new google.maps.DirectionsService();
	        directionsService.route(request, function(response, status) {
	            if (status == google.maps.DirectionsStatus.OK) {
	                // Display the route on the map.
	                directionsDisplay.setDirections(response);
	                userList[index].destination =  $scope.targetLocation;
	                // response.routes may give multiple routes, currently considering only first route
	                userList[index].positions = response.routes[0].overview_path; //gives intermediate coordinates to destination
	                if(index == (userList.length-1)) //call this method once every user's intermediate coordinates are available 
	                	$scope.trackUserPosition();
	            }
	            });
        });
    };

    $scope.loadMap = function() {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Try HTML5 geolocation.
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         var pos = {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         };

        //         infoWindow.setPosition(pos);
        //         infoWindow.setContent('I\'m here.');
        //         map.setCenter(pos);
        //     }, function() {
        //         handleLocationError(true, infoWindow, map.getCenter());
        //     });
        // } else {
        //     // Browser doesn't support Geolocation
        //     handleLocationError(false, infoWindow, map.getCenter());
        // }

        // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        //     infoWindow.setPosition(pos);
        //     infoWindow.setContent(browserHasGeolocation ?
        //         'Error: The Geolocation service failed.' :
        //         'Error: Your browser doesn\'t support geolocation.');
        // }


        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        // function setupClickListener(id, mode) {
        //     var radioButton = document.getElementById(id);
        //     radioButton.addEventListener('click', function() {
        //         travel_mode = mode;
        //     });
        // }
        // setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
        // setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
        // setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);


        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                $scope.targetLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
            $scope.loadDirections();
        });
    },
     
   /* $scope.updateData = function(){
    	//http://localhost:3001/js/data/do.json
    	var newData ={ 
    	    "userData": {
    	        "name": "Koushik",
    	        "src": {
    	          "lat": 12.91221,
    	          "lng": 77.651861
    	        },
    	        "positions": []
    	      },
    	      "id": "56e9454fd4d64dc915f48783"
    	    };
    	$http.put('http://localhost:3000/users/56e9454fd4d64dc915f48783',newData).then(function(data){
    		alert("Success");
    	});
    },*/
  
     $scope.updateUserPosition = function() {
    	var userList =  $scope.userList;
    	var target = $scope.targetLocation;
		userList.forEach(function(val,index){
			var item = val;
			var coOrdinates =  item.positions;
			//alert("No. of Coordinates for"+item.name+ " is "+coOrdinates.length);
			if(coOrdinates[next]){
				
				var curLat = coOrdinates[next].lat();
				var curLong =  coOrdinates[next].lng();
				var newPoint = new google.maps.LatLng(curLat, curLong);

				if(item.marker){
					//to clear older marker
					//item.marker.setMap(null);
					item.marker.setPosition(newPoint);
				}
				else{
						item.marker = new google.maps.Marker({
						position : newPoint,
						map: map,
						label: item.name,
						//icon: imageUrl,
						draggable: true
					});
				}
				item.marker.setMap(map);
				//map.setCenter(newPoint);
			}
			else{
				if (target.lat === item.destination.lat && target.lng === item.destination.lng) {
					destinationReached++;
					//additional features saying who reached destination
					if(destinationReached == userList.length){
						//all people reached destinamtion;
						alert("Every one met");
						next = -1;
						//window.clearInterval(tracker);
						$interval.cancel(tracker);
					}
				}
			}
		});
    }
    
    $scope.trackUserPosition = function(){
    	tracker = $interval(function(){
			next++;
			$scope.updateUserPosition();
		},1000);
    }
    
});