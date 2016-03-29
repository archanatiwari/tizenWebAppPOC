app.factory('GetUserData', function($http) {

    var getData = function() {
        return $http.get('data/user-data.json').then(function(response) {
            return response.data;
            alert(JSON.stringify(response.data));
        }, function(response) {
            console.log('error in fetching' + response.status);
            return [];
        });
    };

    return {
        getData: getData
    };
});

app.service('SharedDataService', function() {
    this.setTargetData = function(data) {
        return this.targetData = data;
    };
    this.getTargetData = function() {
        return this.targetData;
    };
    this.setCurrentUser= function(data){
        return this.currentUser = data;
    };
    this.getCurrentUser = function(){
        return this.currentUser;
    }
    this.setDestination= function(data){
        return this.destination =  data;
    }
    this.getDestination = function(){
        return this.destination;
    }
});