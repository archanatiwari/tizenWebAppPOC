app.factory('SharedFactory', ['$http', function($http) {

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
}]);

app.service('SharedDataService', ['$http', '$timeout' ,function($http, $timeout) {
    this.jsonData = [];
    var self = this;
    var isRequestInProgress = false;
    //this.apiDomain =  "http://192.168.2.68:8080";
    this.apiDomain = "http://localhost:8080";
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

    this.registerUser = function(request, successCB, failureCB){
        var url = "/api/users";
        self.doAjax(url, "POST", request, function(response){
            var userObj = {userName : response.user_name, userId : response.user_id};
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
            var userObj = {userName : response.name, userId : response.user_id};
            self.setCurrentUser(userObj);
            successCB.call(null, response);
        }, function(response){
            self.setCurrentUser({});
            failureCB.call(null, response);
        });
    };

    this.addUserContacts = function(request, successCB, failureCB){
        var url = "/api/contacts";
        self.doAjax(url, "POST", request, successCB, failureCB);
    };

    this.getUserEvents = function(userId, successCB, failureCB){
        var url = "/api/events/"+userId;
        self.doAjax(url, "GET", {}, successCB, failureCB);
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

    this.doAjax = function(url, method, request, successCB, failureCB){
        $.ajax({
              type: method,
              url: self.apiDomain + url,
              data: request,
              success : function (res, status) {
                if((status == "success") && (!res.errmsg)){
                    successCB.call(null,res);
                }else{
                    failureCB.call(null, res);
                }
              },
              // error : function (res, req) {
              //    console.log(res);
              // },
            });
    }

}]);
