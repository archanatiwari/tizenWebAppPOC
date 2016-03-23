app.controller('navigationController', function($scope, $interval, GetUserData, SharedDataService) {
	var next = -1, totalPplMeet = 0, tracker;
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
    	
    	var userList = $scope.userList;
	    
    	userList.forEach(function(value,index){
    	
	        var directionsDisplay = new google.maps.DirectionsRenderer({
	            map: map
	        });
	
	        // Set destination, origin and travel mode.
	        var request = {
	            origin: userList[index].source,
	            destination: $scope.targetLocation,
	            travelMode: google.maps.TravelMode.DRIVING
	        };
	
	        // Pass the directions request to the directions service.
	        var directionsService = new google.maps.DirectionsService();
	        directionsService.route(request, function(response, status) {
	            if (status == google.maps.DirectionsStatus.OK) {
	                // Display the route on the map.
	                directionsDisplay.setDirections(response);
	                userList[index].destination =  $scope.targetLocation;
	                userList[index].positions = response.routes[0].overview_path; //gives intermediate coordinates to destination
	                if(index == (userList.length-1)) //call this method once every user's intermediate coordinates are available 
	                	$scope.trackUserPosition();
	            }
	        });
    	});
    };
    
    $scope.updateUserPosition = function() {
    	var userList =  $scope.userList;
    	var target = $scope.targetLocation;
		userList.forEach(function(val,index){
			var person = val;
			var coOrdinates =  person.positions;
			//alert("No. of Coordinates for"+person.name+ " is "+coOrdinates.length);
			if(coOrdinates[next]){
				
				var curLat = coOrdinates[next].lat();
				var curLong =  coOrdinates[next].lng();
				var newPoint = new google.maps.LatLng(curLat, curLong);

				if(person.marker){
					//to clear older marker
					//person.marker.setMap(null);
					person.marker.setPosition(newPoint);
				}
				else{
						person.marker = new google.maps.Marker({
						position : newPoint,
						map: map,
						label: person.name,
						//icon: imageUrl,
						draggable: true
					});
				}
				person.marker.setMap(map);
				//map.setCenter(newPoint);
			}
			else{
				if ((target.lat === person.destination.lat && target.lng === person.destination.lng) && (!person.reached)) {
					//if(!person.reached){
						person.reached = true;
						totalPplMeet++;
						//all people reached destinamtion;
						if(totalPplMeet == userList.length){
							next = -1;
							$interval.cancel(tracker);
						}
					//}
					
				}	
			}
		});
    };
    
    $scope.trackUserPosition = function(){
    	tracker = $interval(function(){
			next++;
			$scope.updateUserPosition();
		},1000);
    };
});