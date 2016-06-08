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
    //var isRequestInProgress = false;
    //this.apiDomain =  "http://192.168.2.68:8080";
    this.apiDomain = "http://localhost:8080";
    // (function() {
    //     isRequestInProgress = true;
    //     $http.get('data/user-data.json').then(function(response) {
    //         isRequestInProgress = false;
    //         self.jsonData = response.data.data; //response.data --> refers actual data-json, response.data.data --> refers array in data.json
    //     }, function(response) {
    //         console.log('error in fetching' + response.status);
    //         isRequestInProgress = false;
    //         self.jsonData;
    //     });
    // })();

    // this.getJsonData = function(callBackFn) {
    //     if (isRequestInProgress) {
    //         $timeout(function() {
    //             self.getJsonData(callBackFn);
    //         }, 50);
    //     } else {
    //         //return self.jsonData;
    //         callBackFn.apply(null, [self.jsonData])
    //     }
    // };

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

    this.getUserEvents = function(userId, successCB, failureCB){
        var url = "/api/events/"+userId;
        self.doAjax(url, "GET", {}, successCB, failureCB);
    };

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
    }

}]);
