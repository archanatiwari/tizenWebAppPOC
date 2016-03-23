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