// app.factory('SharedFactory', ['$http', function($http) {

//     var getData = function() {
//         return $http.get('data/user-data.json').then(function(response) {
//             return response.data.data;
//         }, function(response) {
//             console.log('error in fetching' + response.status);
//             return [];
//         });
//     };

//     return {
//         getData: getData
//     };
// }]);

app.service('SharedDataService', ['$http', '$timeout' ,function($http, $timeout) {
    this.jsonData = [];
    var self = this;
    //this.apiDomain =  "http://192.168.2.68:8080";
    this.apiDomain = "http://localhost:8080";

    this.doAjax = function(url, method, request, successCB, failureCB){
        $.ajax({
              type: method,
              url: self.apiDomain + url,
              data: request,
              success : function (res, status) {
                if((status == "success")){
                    if(res == null){
                        successCB.call(null, {"errMsg": "no results"});
                    }
                    else if(res.errors){
                        successCB.call(null, {"errMsg":"error while getting results"});
                    }
                    else 
                        successCB.call(null,res);
                }else{
                    failureCB.call(null, res);
                }
              },
              // error : function (res, req) {
              //    console.log(res);
              // },
            });
    };

    this.registerUser = function(request, successCB, failureCB){
        var url = "/api/users";
        self.doAjax(url, "POST", request, function(response){
            var userObj = {name : response.user_name, user_id : response.user_id};
            self.setCurrentUser(userObj);
            successCB.call(null, response);
        }, function(response){
            self.setCurrentUser({});
            failureCB.call(null, response);
        });
    };

    this.getUserInfoFromDb = function(userId, successCB, failureCB){
        var url = "/api/users/"+userId;
        self.doAjax(url, "GET", {}, function(response){
            if(!response.errMsg){
                var userObj = {name : response.name, user_id : response.user_id};
                self.setCurrentUser(userObj);
            }else{
                self.setCurrentUser({});
            }
            successCB.call(null, response);
        }, function(response){
            self.setCurrentUser({});
            failureCB.call(null, response);
        });
    };

    this.getContactsFromDb = function(userId, successCB, failureCB){
        var url = "/api/contacts/"+userId;
        self.doAjax(url, "GET", {}, function(response){
            if(!response.errMsg)
                self.setUserContacts(response.contact_list);
            else
                self.setUserContacts([]);
            successCB.call(null, response);
        }, function(response){
            self.setUserContacts([]);
            failureCB.call(null, response);
        });
    };

    this.addUserContacts = function(request, successCB, failureCB){
        var url = "/api/contacts";
        self.doAjax(url, "POST", request, function(response){
            if(!response.errMsg)
                self.setUserContacts(response.contact_list);
            else
                self.setUserContacts([]);
            successCB.call(null, response);
        }, function(response){
            self.setUserContacts([]);
            failureCB.call(null, response);
        });
    };

    this.addNewEvent = function(request, successCB, failureCB){
        var url = "/api/events";
        self.doAjax(url, "POST", request, function(response){
            successCB.call(null, response);
        }, function(response){
            failureCB.call(null, response);
        });
    };

    this.getEventsFromDb = function(userId, successCB, failureCB){
        var url = "/api/events/"+userId;
        self.doAjax(url, "GET", {}, successCB, failureCB);
    };

    //list of getters and settres
    this.setUserContacts = function(contacts){
        this.userContacts = JSON.parse(JSON.stringify(contacts));
    };

    this.getUserContacts = function(){
        return this.userContacts;
    };

    this.setTargetData = function(data) {
        return this.targetData = JSON.parse(JSON.stringify(data));
    };
    this.getTargetData = function() {
        return this.targetData;
    };

    this.setCurrentUser = function(data) {
        return this.currentUser = JSON.parse(JSON.stringify(data));
    };
    this.getCurrentUser = function() {
        return this.currentUser;
    };

    this.setDestination = function(data) {
        return this.destination = JSON.parse(JSON.stringify(data));
    };
    this.getDestination = function() {
        return this.destination;
    };

    this.setEventData = function(eventObj) {
        this.selectedEvent = JSON.parse(JSON.stringify(eventObj));
    };

    this.getEventData = function() {
        return this.selectedEvent;
    };

    this.setAddedUsers = function(addedUsers) {
        this.getAddedUsers = JSON.parse(JSON.stringify(addedUsers));
    };
    
    this.getAddedUsers = function() {
        return this.getAddedUsers;
    };

    this.setEventName = function(eventName) {
        this.eventName = eventName;
    };
    
    this.getEventName = function() {
        return this.eventName;
    };
    this.setRecentlySearchedData = function(recentSearched) {
        this.getRecentSearches = JSON.parse(JSON.stringify(recentSearched));
    };
    
    this.getRecentlySearchedData = function() {
        return this.getRecentSearches;
    };

    

}]);

app.directive("headerTemplate",function(){
	return{
		restrict: 'E',
		templateUrl: 'partials/header.html',
		controller: 'headerController'
	}
})
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

app.controller('headerController',['$scope', 'SharedDataService', function($scope, SharedDataService){

     
}]);
app.controller('homeController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

    function customiseInviteeList(inviteeList){
        var customInviteeList = "";
        var str = "";
        //doing this for customizing invitee list
        for (var i = 0; i < inviteeList.length; i++) {
            var invitee = inviteeList[i].name;
            if (inviteeList.length == 1) {
                customInviteeList = invitee;
                break;
            }
            if (inviteeList.length <= 4) {
                if (inviteeList[i + 1]) {
                    str += invitee;
                    if (inviteeList[i + 2])
                        str += ", ";
                } else {
                    str += " and " + invitee;
                    customInviteeList = str;
                    break;
                }
            } else {
                if (i <= 3) {
                    str += invitee;
                    if (i < 3)
                        str += ", ";
                } else {
                    var remainingPpl = inviteeList.length - i;
                    str += " and " + remainingPpl + " more";
                    customInviteeList = str;
                    break;
                }
            }
        }
        return customInviteeList;
    };

    $scope.currentUser = SharedDataService.getCurrentUser();
    $scope.upcomingEvents = [];
    $scope.allEvents = [];
    SharedDataService.getEventsFromDb($scope.currentUser.user_id, function(response){
       var userId = $scope.currentUser.user_id;
       var allEventList = [], upcomingEventList = [];
        angular.forEach(response, function(event, key){
            var inviteeList = event.invitee_list;
            for (var i=0; i<inviteeList.length; i++){
                if(userId == inviteeList[i].user_id){
                     if (inviteeList[i].status == "ACCEPTED") {
                        event.statusClass = "accepted";// this field is css class name
                        event.status = "accepted"; 
                    } else if ($inviteeList[i].status == "PENDING") {
                        event.statusClass = "pending";
                        event.status = "pending";
                        event.customisedInviteeList = customiseInviteeList(event.inviteeList);
                    } else {
                        event.statusClass = "rejected";
                        event.status = "rejected";
                    }
                }
            }
           
            //push upcoming event list
            var eventDate = new Date(event.event_date);
            if (eventDate >= new Date()) {
                upcomingEventList.push(event);
            }
            var curDate = new Date();
            if ((eventDate.getDate() == curDate.getDate()) && (eventDate.getMonth() == curDate.getMonth()) && (eventDate.getFullYear() == curDate.getFullYear())) {
                event.displayDate = "Today";
            } else {
                event.displayDate = eventDate;
            }

            //push event to allEventList
            allEventList.push(event);   
        });
        //update the model
        $scope.allEvents = allEventList;
        $scope.upcomingEvents = upcomingEventList;

    }, function(response) {
        
    });

    $scope.getEventDetails = function(eventObj) {
        SharedDataService.setEventData(eventObj);
        $state.go('navigation');
    };

}]);

app.controller('inviteeListController', ['$scope', 'SharedDataService', function($scope, SharedDataService) {
    $scope.selectedEvent = SharedDataService.getEventData();
    $scope.inviteeList = $scope.selectedEvent.invitee_list;
    $scope.statusText;
    $scope.status= "";

    for (var i = 0; i<$scope.inviteeList.length; i++) {
        if ($scope.inviteeList[i].status == "ACCEPTED") {
            $scope.inviteeList[i].statusClass = "accepted";
        } else if ($scope.inviteeList[i].status == "PENDING") {
            $scope.inviteeList[i].statusClass = "pending";
        } else {
            $scope.inviteeList[i].statusClass = "rejected";
        }

    }

    if ($scope.selectedEvent.status == "pending") {
        $scope.statusText = "You haven't dicided yet"
        $scope.status = "pending";


    }else if($scope.selectedEvent.status == "accepted"){
    	$scope.statusText = "You are going to this event"
        $scope.status = "accepted";
    }
    else{
    	$scope.status = "rejected";
    }

}]);

app.controller('landingController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

	(function(){

		if((localStorage) && (localStorage.getItem('registeredUser') != null)){
			var userId = localStorage.getItem('registeredUser');
			SharedDataService.getUserInfoFromDb(userId, function(response){
                SharedDataService.getContactsFromDb(userId, function(res){
                	 $state.go('home');
                }, function(res){
              	});
               
            }, function(response){
                 localStorage.removeItem('registeredUser');
            });
		}
		else{
			$state.go('login');
		}

	})();

}]);
app.controller('locationController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

    $scope.inputText = document.getElementById('pac-input');
    $scope.searchBox = new google.maps.places.SearchBox($scope.inputText);
    $scope.location = "";
    //$scope.newEventName = SharedDataService.getEventName();
    
    // $scope.targetName = [];
    $scope.recentSearchedPlaces = SharedDataService.getRecentlySearchedData();

    if ($scope.recentSearchedPlaces) {
        $scope.recentSearchedPlaces;
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

    $scope.setLocation = function() {
        SharedDataService.setDestination($scope.location);
        $scope.setRecentSearch();
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
}]);

app.controller('loginController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {
    
    function getDeviceContacts(callBack){
        var contactArr = [], defaultAddressBook = [];
        if(typeof(tizen) !== "undefined"){
            function contactsFoundCB(contacts) {
                angular.forEach(contacts, function(contact, key){
                    var obj = {};
                    obj.name = contact.name.firstName + (contact.name.lastName ? contact.name.lastName : ""); 
                    obj.contact_id = contact.phoneNumbers[0].number; //considering first number
                    obj.profile_pic = (contact.photoURI ? contact.photoURI : "");
                    contactArr.push(obj);
                });
                callBack.apply(null, [contactArr]);
            }
            
            function errorCB(err) {
                console.log('The following error occurred: ' +  err.name);
                callBack.apply(null, [contactArr]);
            }
                
           defaultAddressBook = tizen.contact.getDefaultAddressBook();
           defaultAddressBook.find(contactsFoundCB, errorCB);
        }
        else{
            //default contacts, for testing purpose
            var obj1 = {}, obj2 = {};
            
            obj1.name = "Charan Adiga"; 
            obj1.contact_id = "919878721704";
            obj1.profile_pic = "";

            obj2.name = "Archit Soni"; 
            obj2.contact_id = "918972721704";
            obj2.profile_pic = "";
            
            contactArr.push(obj1);
            contactArr.push(obj2);
            
            callBack.apply(null, [contactArr]);
        }
    };

    $scope.doRegister = function(){
        var requestObj = {};
        var phoneNo = $scope.phoneNo;
        if($scope.userName != "" && $scope.phoneNo != ""){
            requestObj.name = $scope.userName;
            requestObj.user_id = phoneNo;
            SharedDataService.registerUser(requestObj, function(response){
                localStorage.setItem('registeredUser', $scope.phoneNo);
                //get device contacts & add to DB
                getDeviceContacts(function(contactList){
                    var contactReq = {};
                    contactReq.contact_list = contactList;
                    contactReq.user_id = phoneNo;
                    SharedDataService.addUserContacts(contactReq, function(res){
                        $state.go('home');
                    }, function(res){
                        //unable add contacts to db
                    });
                });
                
            }, function(response){
                localStorage.removeItem('registeredUser');
                alert("Unable to Register");
            });
        }
    };
}]);

app.controller('navigationController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {
	
    var map, curUserMarker, directionsDisplay, directionsService, curUserPosition, userRoutes;

	var next = -1, totalPplReached = 0, tracker;
    $scope.selectedEvent = SharedDataService.getEventData();
    $scope.currentUser =  SharedDataService.getCurrentUser();
    
    $scope.targetLocation = $scope.selectedEvent.coordinates;
   	$scope.toggleStartBtn = true;
    $scope.enableTrackBtn = ($scope.selectedEvent.status == "ACCEPTED") ? true : false; 
    $scope.customisedInviteeList = "", $scope.arrivedPpl = [];
    $scope.showAnimation = false, $scope.trackingMode = false;

	function customiseInviteeList(){
	    //doing this for customizing invitee list
	    var customInviteeList = "", str = "";
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
    	// if (selectedEvent.status == "ACCEPTED") {
    	// 	selectedEvent.statusClass = "accepted";
     //    } else if (selectedEvent.status == "PENDING") {
     //        selectedEvent.statusClass = "pending";
     //    } else {
     //        selectedEvent.statusClass = "rejected";
     //    }
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
app.controller('newEventController', ['$scope', '$state', 'SharedDataService', function($scope, $state, SharedDataService) {

    $scope.invitees = SharedDataService.getAddedUsers;
    $scope.location = SharedDataService.getDestination();
    $scope.currentUser = SharedDataService.getCurrentUser();
    $scope.addedUsers = "";

    $scope.eventName = SharedDataService.getEventName();
    if ($scope.eventName) {
        $scope.eventName;
    }else{
        $scope.eventName = "";
    }

    angular.forEach($scope.invitees, function(invitee, index){
        if(index == $scope.invitees.length-1)
            $scope.addedUsers += invitee.name;
        else
            $scope.addedUsers += invitee.name + " / ";
    });

    var d = new Date();

    var h = d.getHours();
    var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var ampm = h >= 12 ? 'p.m.' : 'a.m.';
    var hours = h >= 12 ? h - 12 : h;
    $scope.eventTime = hours + ':' + m + ' ' + ampm;
    $scope.eventDate = d;

    function getCoordinates(address, callBackFn) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var coordinates = {
                    lat : results[0].geometry.location.lat(),
                    lng : results[0].geometry.location.lng()
                };
                callBackFn(coordinates);
            } else {
                callBackFn(null);
            }
        });
    };

    $scope.updateEventName = function() {
        SharedDataService.setEventName($scope.eventName);
    };

    $scope.createNewEvent = function(){
        //validate all input fields before making ajax;
        if(!($scope.eventName == "") || ($scope.location == "") || ($scope.eventDate == "") || ($scope.eventTime = "") || ($scope.invitees.length == 0)){ 
            //get the cocordinates of event location
            getCoordinates($scope.location, function(coordinates){
                if(!coordinates){
                    alert("Unable to get location coordinates");
                }
                else{
                    var eventReq = {};
                    eventReq.title = $scope.eventName;
                    eventReq.location = $scope.location;
                    eventReq.coordinates = coordinates;

                    //setting event date and time
                    eventReq.event_date = $scope.eventDate.toDateString();
                    eventReq.event_time = $scope.eventTime;

                    var inviteeList = [];
                    angular.forEach($scope.invitees, function(invitee){
                        var obj = {};
                        obj.name = invitee.name;
                        obj.user_id = invitee.contact_id;
                        obj.status = "PENDING";
                        inviteeList.push(obj);
                    });
                    //keep event organiser in invitee list
                    var organiser = {};
                    organiser.name = $scope.currentUser.name;
                    organiser.user_id = $scope.currentUser.user_id;
                    organiser.status = "ACCEPTED"; // by default event status for organiser is  ACCEPTED;
                    inviteeList.push(organiser);

                    eventReq.user_id = $scope.currentUser.user_id;
                    eventReq.invitee_list = inviteeList;
                   
                    SharedDataService.addNewEvent(eventReq, function(response){
                        $state.go('home');
                    }, function(response){
                        alert("Failed to create event");
                    });
                }
            });
        }
        else{
            alert("Please fill required fileds");
        }
    };

}]);

