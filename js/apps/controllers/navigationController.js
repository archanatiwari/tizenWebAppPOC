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

    var bangalore = { lat: 12.9715987, lng: 77.5945627 };
    var hsrLayout = { lat: 12.9081357, lng: 77.647608 };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: bangalore,
        // scrollwheel: false,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    // Set destination, origin and travel mode.
    var request = {
        destination: hsrLayout,
        origin: bangalore,
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

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

// var Map = function() {
//     this.map = new google.maps.Map(<target-place>,{center:,zoom:});
// };