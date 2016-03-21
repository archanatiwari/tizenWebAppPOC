app.controller('navigationController', function($scope) {
    function detectBrowser() {
        var useragent = navigator.userAgent;
        var mapdiv = document.getElementById("map");

        if (useragent.indexOf('Tizen') != -1 || useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
            mapdiv.style.width = '100%';
            mapdiv.style.height = '80%';
        } else {
            mapdiv.style.width = '100%';
            mapdiv.style.height = '80%';
            // console.log('This is not a Tizen device!!!');
        }
    }
    detectBrowser();
    var origin_place_id = null;
    var destination_place_id = null;
    var travel_mode = google.maps.TravelMode.WALKING;
    var mapView = document.getElementById('map');
    var mapOptions = {
        center: { lat: 12.9715987, lng: 77.5945627 }, // bangalore
        zoom: 13
            // mapTypeId: google.maps.MapTypeId.ROADMAP,
            // mapTypeControl: false
    };
    var map = new google.maps.Map(mapView, mapOptions);
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });
    // directionsDisplay.setMap(map);

    try {
        var directionsService = new google.maps.DirectionsService();

        function route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay) {
            if (!origin_place_id || !destination_place_id) {
                return;
            }
            directionsService.route({
                origin: { 'placeId': origin_place_id },
                destination: { 'placeId': destination_place_id },
                travelMode: travel_mode
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var traversingData;
                    var markerMotion;
                    traversingData = response.routes[0].overview_path;

                    // for (var travel of traversingData) {
                    //     var motionLatitude = travel.lat();
                    //     var motionLongitude = travel.lng();
                    //     markerMotion = { motionLatitude, motionLongitude };
                    // }





                    // Use 'markerMotion' for dummy coordinates along the path
                    // to show the device motion sensing effect

                    angular.forEach(traversingData, function(travel, key) {
                        var motionLatitude = travel.lat();
                        var motionLongitude = travel.lng();
                        markerMotion = { motionLatitude : motionLatitude , motionLongitude : motionLongitude };
                    });








                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var origin_input = document.getElementById('start');
        var destination_input = document.getElementById('end');
        var modes = document.getElementById('mode-selector');

        var searchBox = new google.maps.places.SearchBox(input);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
        destination_autocomplete.bindTo('bounds', map);

        origin_autocomplete.addListener('place_changed', function() {
            var place = origin_autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            expandViewportToFitPlace(map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            origin_place_id = place.place_id;
            route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

        destination_autocomplete.addListener('place_changed', function() {
            var place = destination_autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            expandViewportToFitPlace(map, place);

            // If the place has a geometry, store its place ID and route if we have
            // the other place ID
            destination_place_id = place.place_id;
            route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
        });


        // // Set destination, origin and travel mode.
        // var request = {
        //     destination: destination_input,
        //     origin: origin_input,
        //     travelMode: google.maps.TravelMode.DRIVING
        // };

        // // Pass the directions request to the directions service.
        // var directionsService = new google.maps.DirectionsService();
        // var traversingData;
        // var markerMotion;
        // directionsService.route(request, function(response, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //         // Display the route on the map.
        //         directionsDisplay.setDirections(response);
        //         traversingData = response.routes[0].overview_path;

        //         for (var travel of traversingData) {
        //             var motionLatitude = travel.lat();
        //             var motionLongitude = travel.lng();
        //             markerMotion = { motionLatitude, motionLongitude };
        //         }
        //     } else {
        //         window.alert('Directions request failed due to ' + status);
        //     }
        // });

    } catch (e) {
        console.log(e.message);
    } finally {
        var infoWindow = new google.maps.InfoWindow({ map: map });

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('I\'m here.');
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        }

    }







    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            travel_mode = mode;
        });
    }
    setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
    setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
    setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);


    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }

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
    });


});