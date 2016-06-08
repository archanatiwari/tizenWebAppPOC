app.controller('navigationController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {
	
    var map, curUserMarker, directionsDisplay, directionsService, curUserPosition, userRoutes;

	var next = -1, totalPplReached = 0, tracker;
    $scope.selectedEvent = SharedDataService.getEventData();
    $scope.currentUser =  SharedDataService.getCurrentUser();
    
    $scope.targetLocation = $scope.selectedEvent.coordinates;
   	$scope.toggleStartBtn = true;
    $scope.enableTrackBtn = ($scope.selectedEvent.mystatus == "ACCEPTED") ? true : false; 
    $scope.customisedInviteeList = "", $scope.arrivedPpl = [];
    $scope.showAnimation = false, $scope.trackingMode = false;

	function customiseInviteeList(){
	    //doing this for customizing invitee list
	    var customInviteeList = "", str;
	    var inviteeList = $scope.selectedEvent.invitee_list;
	    for(var i=0; i<inviteeList.length; i++){
	    	var invitee = inviteeList[i].name;
	    	if(inviteeList.length == 1){
	    		customInviteeList = invitee;
	    		break;
	    	}
	    	if(inviteeList.length <= 4){
	    		if(inviteeList[i+1]){
	    			str += invitee;
	    			if(inviteeList[i+2])
	    				str += ", ";
	    		}else{
					str += " and "+invitee;
					customInviteeList = str;
	    			break;
	    		}
	    	}
	    	else{
	    		if(i <= 3){
	    			str += invitee;
	    			if(i<3)
	    				str += ", ";
	    		}else{
	    			var remainingPpl = inviteeList.length - i;
					str += " and "+ remainingPpl +" more";
					customInviteeList = str;
	    			break;
	    		}
	    	}
	    }
	    $scope.customisedInviteeList = customInviteeList;
	};
    
    $scope.updateSelectedEventStatus = function(){
    	var selectedEvent = $scope.selectedEvent;
    	if (selectedEvent.mystatus == "ACCEPTED") {
    		selectedEvent.statusClass = "accepted";
        } else if (selectedEvent.mystatus == "PENDING") {
            selectedEvent.statusClass = "pending";
        } else {
            selectedEvent.statusClass = "rejected";
        }
        var date = new Date(selectedEvent.eventDate);
        var curDate = new Date();
        if (date.getDate() == curDate.getDate() && date.getMonth() == curDate.getMonth() && date.getFullYear() == curDate.getFullYear()) {
            selectedEvent.eventDate = "Today";
        } else {
            selectedEvent.eventDate = date;
        }

        customiseInviteeList();
    };
    
    function loadMap(){
	    map = new google.maps.Map(document.getElementById('map'), {
	        center: $scope.targetLocation,
	        scrollwheel: true,
	        zoom: 13,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        disableDefaultUI: true, // way to hide all controls
	    });
	    
	    //set the marker to destination
	    var marker = new google.maps.Marker({
	        position: $scope.targetLocation,
	        map: map,
	    });
	    
	    //to show Directions button on map
	    var directionBtn = document.createElement('div');
	    directionBtn.style.padding = "0px 0px 20px 0px";
	    var directopnControl =  new createCustomBtn(directionBtn, map);
	    //directopnControl .index = 1;
	    
	    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(directionBtn);
    };

    function getDirections(){
    	directionsDisplay.setDirections(userRoutes);
    };

    function createCustomBtn(controlDiv, map) {
	  // Set CSS for the control border.
	  var controlUI = document.createElement('div');
	  controlUI.setAttribute('id', 'mapdirectionBtn');
	  controlUI.style.backgroundColor = '#493073';
	  controlUI.style.border = '2px solid #493073';
	  controlUI.style.borderRadius = '10px';
	  controlUI.style.marginRight = '12px';
	  controlUI.style.textAlign = 'center';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior.
	  var controlText = document.createElement('div');
	  controlText.style.color = 'white';
	  //controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	  controlText.style.fontSize = '16px';
	  // controlText.style.lineHeight = '32px';
	  controlText.style.paddingLeft = '5px';
	  controlText.style.paddingRight = '5px';
	  controlText.innerHTML = 'Directions';
	  controlUI.appendChild(controlText);

	  controlUI.addEventListener('click', function() {
		  getDirections();
	  });

	};
	
	function pinSymbol(color) {
        return {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            //url: "images/user_icon_g.png",
        };
    };
    
    function setUserPosition(){
	    curUserMarker = new MarkerWithLabel({
	        position: curUserPosition,
	        map: map,
	        labelContent: "You",
			labelAnchor: new google.maps.Point(10, 45),
			labelClass: "labels",
			labelInBackground: false,
			icon: pinSymbol('#00387B')
	    });
    };

    function getCoordinates(){
  		directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            //polylineOptions:{strokeColor:"#493073",strokeWeight:2}
        });

        // Set destination, origin and travel mode.
        var request = {
            origin: curUserPosition,
            destination: $scope.targetLocation,
            travelMode: google.maps.TravelMode.DRIVING
        };

        // Pass the directions request to the directions service.
        directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Display the route on the map.
                //directionsDisplay.setDirections(response);
            	// saving this in currentUser to show directions, once he clicks 'Directions' btn
            	//if((curUserPosition.lat == response.request.origin.lat) && (curUserPosition.lng == response.request.origin.lng))
            	userRoutes = response;
                //userList[index].destination =  $scope.targetLocation;
                //userList[index].positions = response.routes[0].overview_path; //gives intermediate coordinates to destination
//	                if(index == (userList.length-1)) //call this method once every user's intermediate coordinates are available 
//	                	$scope.trackUserPosition();
            }
        });
    };

    $scope.updateSelectedEventStatus();
    
    (function(){
    	navigator.geolocation.getCurrentPosition(function(position) {
	  		curUserPosition = {
	    		lat: position.coords.latitude,
	    		lng: position.coords.longitude
	  		};
	  		loadMap();
	    	setUserPosition();
	    	getCoordinates();
    	});
	}());
}]);