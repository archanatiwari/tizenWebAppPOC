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

