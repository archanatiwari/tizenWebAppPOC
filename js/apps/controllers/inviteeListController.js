app.controller('inviteeListController', function($scope, SharedDataService) {
	 $scope.selectedEvent = SharedDataService.getEventData();
	 $scope.inviteeList = $scope.selectedEvent.UsersInvited;
});