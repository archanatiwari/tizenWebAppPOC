app.controller('navigationController' ,function($scope){

//var mapOption={
//		zoom:4,
//		center:new google.map.LatLng(25,80),
//		mapTypeId:google.maps.MapTypeId.ROADMAP
//}
//$scope.map = newgoogle.maps.Map(document.getElementById('map'),mapOptions);
//$scope.marker=[];
	
	 var directionsService = new google.maps.DirectionsService();
     var directionsDisplay = new google.maps.DirectionsRenderer();

     var map = new google.maps.Map(document.getElementById('map'), {
       zoom:15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     });

     directionsDisplay.setMap(map);
     directionsDisplay.setPanel(document.getElementById('panel'));

     var request = {
       origin: {lat:12.9160460,lng:77.6523890}, 
       destination: {lat:12.9165532,lng:77.6491113},
       travelMode: google.maps.DirectionsTravelMode.DRIVING
     };

     directionsService.route(request, function(response, status) {
       if (status == google.maps.DirectionsStatus.OK) {
         directionsDisplay.setDirections(response);
       }
     });
});