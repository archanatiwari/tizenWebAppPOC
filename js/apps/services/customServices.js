app.factory('SharedFactory', function($http) {

    var getData = function() {
        return $http.get('data/user-data.json').then(function(response) {
            return response.data.data;
        }, function(response) {
            console.log('error in fetching' + response.status);
            return [];
        });
    };

    return {
        getData: getData
    };
});

app.service('SharedDataService', function($http, $timeout) {
    this.jsonData = [];
    var self = this;
    var isRequestInProgress = false;
    (function() {
        isRequestInProgress = true;
        $http.get('data/user-data.json').then(function(response) {
            isRequestInProgress = false;
            self.jsonData = response.data.data; //response.data --> refers actual data-json, response.data.data --> refers array in data.json
        }, function(response) {
            console.log('error in fetching' + response.status);
            isRequestInProgress = false;
            self.jsonData;
        });
    })();

    this.getJsonData = function(callBackFn) {
        if (isRequestInProgress) {
            $timeout(function() {
                self.getJsonData(callBackFn);
            }, 50);
        } else {
            //return self.jsonData;
            callBackFn.apply(null, [self.jsonData])
        }
    };

    this.setTargetData = function(data) {
        return this.targetData = data;
    };
    this.getTargetData = function() {
        return this.targetData;
    };

    this.setCurrentUser = function(data) {
        return this.currentUser = data;
    };
    this.getCurrentUser = function() {
        return this.currentUser;
    };

    this.setDestination = function(data) {
        return this.destination = data;
    };
    this.getDestination = function() {
        return this.destination;
    };

    this.setEventData = function(eventObj) {
        this.selectedEvent = eventObj;
    };
    this.getEventData = function() {
        return this.selectedEvent;
    };

    this.setAddedUsers = function(addedUsers) {
        this.getAddedUsers = addedUsers;
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
        this.getRecentSearches = recentSearched;
    };
    
    this.getRecentlySearchedData = function() {
        return this.getRecentSearches;
    };

});
